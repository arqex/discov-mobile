export default function (store, api, actions ){	
	if( store.account === undefined ){
		console.log('Starting auth actions');

		store.account = false // User data will live here
		store.loginStatus = 'INIT' // INIT, IN, OUT, REQUIRE_NEW_PASSWORD, VERIFY_CONTACT
		store.loginLoading = true
		store.federatedLoginLoading = false
	}

	const authActions = {
    login: async function(email, password) {
			store.loginLoading = true;
			return api.login( email, password ).then( response => {
				return handleLoginResponse( store, api, actions, response, {email, password} );
			});
    },

		federatedLogin: async function () {
			store.loginLoading = true
			store.federatedLoginLoading = true;

			return await handleLoginResponse(store, api, actions, await api.auth.federatedLogin(), null);
		},
		
		register: async function register( email, password ){
			store.loginLoading = true;
      return await handleLoginResponse( store, api, actions, await api.register( email, password ), {email,password}	);
		},

		verifyAccount: async function verifyAccount( email, code ){
			store.loginLoading = true;
			const password = store.pendingVerifyUser && store.pendingVerifyUser.password;
			return api.verifyAccount( email, password, code )
				.then( result => {
					return handleLoginResponse(store, api, actions, result.credentials || result, store.pendingVerifyUser);
				})
			;
		},

		resendVerificationEmail: function resendVerificationEmail( email ){
			return api.auth.resendVerificationEmail( email );
		},

		requestPasswordReset: function requestPasswordReset( email ){
			return api.auth.requestPasswordReset( email );
		},

		resetPassword: async function resetPassword( email, code, newPassword ){
			store.loginLoading = true;
			return api.resetPassword( email, code, newPassword )
				.then( () => api.login( email, newPassword ) )
				.then( loginRes => handleLoginResponse( store, api, actions, loginRes.credentials || loginRes, {email, newPassword} ) )
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
					return handleLoginResponse( store, api, actions, response, credentials )
				})
				.catch( err => {
					console.error( err );
				})
			;
		},
		
		logout: async function logout() {
			return await api.logout()
				.then( () => {
					Object.keys( store ).forEach( key => {
						if( typeof store[key] === 'object' ){
							store[key] = {};
						}
					});
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
function handleLoginResponse(store, api, actions, result, credentials) {
	if (!result) {
		store.user = false;
		endLogin(store, 'OUT');
		return Promise.resolve(result);
	}

	if (result.error) {
		store.user = false;
		endLogin(store, 'OUT');

		// Not confirmed coming from login
		if (result.error === "UserNotConfirmedException") {
			store.pendingVerifyUser = credentials;
		}
		else if (result.error === 'NewPasswordRequired') {
			api.auth.pendingPasswordUser = credentials.email;
		}

		return Promise.resolve({
			...result,
			email: credentials.email
		});
	}

	store.user = {
		id: result.user.id,
		email: result.user.email
	};

	if ( result.user.userConfirmed ) {
		return actions.account.loadOrCreateAccount()
			.then( () => {
				endLogin(store, 'IN');
				return store.user;
			})
		;	
	}
	else {
		store.pendingVerifyUser = {...credentials};
		return Promise.resolve({
			error: 'UserNotConfirmedException',
			email: credentials.email
		});
	}
}

function endLogin( store, loginStatus ){
	console.log('endLogin', loginStatus);
	store.loginStatus = loginStatus;
	store.loginLoading = false;
	store.federatedLoginLoading = false;
}