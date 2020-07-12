import { uuidTo64 } from "../../utils/uuid"

export default function( store, api ){	
	if( store.account === undefined ){
		console.log('Starting auth actions');
		
		store.account = false // User data will live here
		store.loginStatus = 'INIT' // INIT, IN, OUT, REQUIRE_NEW_PASSWORD, VERIFY_CONTACT
		store.loginLoading = true
		store.autologinLoading = false
		store.federatedLoginLoading = false
	}

	const authActions = {
    login: async function(email, password) {
			store.loginLoading = true;
			let result = await handleLoginResponse( store, api, await api.login( email, password ), {email,password} );
			console.log( 'login', result );
			return result;
    },

    autoLogin: async function () {
      store.loginLoading = true
			store.autologinLoading = true
			
			console.log('autologining');
			
			try {
				let response = await handleLoginResponse(store, api, await api.autoLogin(), null);
				console.log( response );
				return response;
			}
      catch( err ){
				console.log( err );
			}
		},

		federatedLogin: async function () {
			store.loginLoading = true
			store.federatedLoginLoading = true;

			return await handleLoginResponse(store, api, await api.auth.federatedLogin(), null);
		},
		
		register: async function register( email, password ){
			store.loginLoading = true;
      return await handleLoginResponse( store, api, await api.auth.register( email, password ), {email,password}	);
		},

		verifyAccount: async function verifyAccount( email, code ){
			store.loginLoading = true;
			const password = store.pendingVerifyUser && store.pendingVerifyUser.password;
			return await handleLoginResponse( store, api, await api.auth.verifyAccount( email, password, code ), store.pendingVerifyUser );
		},

		resendVerificationEmail: async function resendVerificationEmail( email ){
			return await api.auth.resendVerificationEmail( email );
		},

		requestPasswordReset: async function requestPasswordReset( email ){
			return await api.auth.requestPasswordReset( email );
		},

		resetPassword: async function resetPassword( email, code, newPassword ){
			store.loginLoading = true;
			return api.auth.resetPassword( email, code, newPassword )
				.then( () => api.login( email, newPassword ) )
				.then( loginRes => handleLoginResponse( store, api, loginRes, {email, newPassword} ) )
				.catch( err => {
					console.error( err );
				})
			;
		},

		completeNewPassword: async function completeNewPassword( newPassword ){
			store.loginLoading = true;
			return api.auth.completeNewPassword( api.auth.pendingPasswordUser, newPassword )
				.then( response => {
					let credentials = {
						email: api.auth.pendingPasswordUser.challengeParam.userAttributes.email,
						password: newPassword
					};
					delete api.auth.pendingPasswordUser;
					return handleLoginResponse( store, api, response, credentials )
				})
				.catch( err => {
					console.error( err );
				})
			;
		},
		
		logout: async function logout() {
			return await api.logout()
				.then( () => {
					store.account = false;
					store.loginStatus = 'OUT';
					store.loginLoading = false;
				})
			;
		}
	}

	return authActions;
}


/**
 * Receives the response from a login request and updates the store accordingly.
 * @param {*} store The app reactive store
 * @param {*} response The response data from a login request
 * @returns `true` if the login succeeded, the error object otherwise
 */
async function handleLoginResponse( store, api, response, credentials ){
	if( !response ){
		store.user = false;
		endLogin(store, 'OUT');
		return;
	}

	if( response.error ){
		store.user = false;
		endLogin(store, 'OUT');

		let code = response.error.code;

		// Not confirmed coming from login
		if (code === "UserNotConfirmedException" ){
			store.pendingVerifyUser = credentials;
		}

		return {
			error: response.error,
			email: credentials && credentials.email
		};
	}

	if( response.user.challengeName === 'NEW_PASSWORD_REQUIRED' ){
		endLogin(store, 'OUT');
		// The user object has methods that would be lost if we keep it
		// in the store. Add it directly to the api that know how to use it
		api.auth.pendingPasswordUser = response.user;
		return {
			error: { code: 'NewPasswordRequired' },
			email: credentials.email
		}
	}
	// Not confirmed coming from register
	else if( response.user.userConfirmed === false ){
		endLogin(store, 'OUT');
		store.pendingVerifyUser = credentials;
		return {
			error: {code: 'UserNotConfirmedException'},
			email: credentials.email
		}
	}
	
	const account = {
		id: getAccountId( response.user.attributes.sub ),
    email: response.user.attributes.email
	}
  
	store.user = account;

	endLogin(store, 'IN');
	return account;
}

function endLogin( store, loginStatus ){
	console.log('endLogin', loginStatus);
	store.loginStatus = loginStatus;
	store.loginLoading = false;
  store.autologinLoading = false;
	store.federatedLoginLoading = false;
}


function getAccountId( sub ){
	// Test users already have the real id
	if( sub.startsWith('acTU') ){
		return sub;
	}

	// We need to transform cognito ones
	return 'ac' + uuidTo64( sub );
}