export default function( store, api, auth ){	
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
			return auth.login( email, password ).then( credentials => {
				return handleLoginResponse( store, api, auth, credentials, {email, password} );
			});
    },

		federatedLogin: async function () {
			store.loginLoading = true
			store.federatedLoginLoading = true;

			return await handleLoginResponse(store, api, auth, await auth.federatedLogin(), null);
		},
		
		register: async function register( email, password ){
			store.loginLoading = true;
      return await handleLoginResponse( store, api, auth, await auth.register( email, password ), {email,password}	);
		},

		verifyAccount: async function verifyAccount( email, code ){
			store.loginLoading = true;
			const password = store.pendingVerifyUser && store.pendingVerifyUser.password;
			return await handleLoginResponse( store, api, auth, await auth.verifyAccount( email, password, code ), store.pendingVerifyUser );
		},

		resendVerificationEmail: function resendVerificationEmail( email ){
			return auth.resendVerificationEmail( email );
		},

		requestPasswordReset: function requestPasswordReset( email ){
			return auth.requestPasswordReset( email );
		},

		resetPassword: async function resetPassword( email, code, newPassword ){
			store.loginLoading = true;
			return auth.resetPassword( email, code, newPassword )
				.then( () => api.login( email, newPassword ) )
				.then( loginRes => handleLoginResponse( store, api, auth, loginRes, {email, newPassword} ) )
				.catch( err => {
					console.error( err );
				})
			;
		},

		completeNewPassword: async function completeNewPassword( newPassword ){
			store.loginLoading = true;
			return auth.completeNewPassword( auth.pendingPasswordUser, newPassword )
				.then( response => {
					let credentials = {
						email: auth.pendingPasswordUser.challengeParam.userAttributes.email,
						password: newPassword
					};
					delete auth.pendingPasswordUser;
					return handleLoginResponse( store, api, auth, response, credentials )
				})
				.catch( err => {
					console.error( err );
				})
			;
		},
		
		logout: async function logout() {
			return await auth.logout()
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
async function handleLoginResponse(store, api, auth, result, credentials) {
	if (!result) {
		store.user = false;
		endLogin(store, 'OUT');
		return;
	}

	if (result.error) {
		store.user = false;
		endLogin(store, 'OUT');

		// Not confirmed coming from login
		if (result.error === "UserNotConfirmedException") {
			store.pendingVerifyUser = credentials;
		}
		else if (result.error === 'NewPasswordRequired' ) {
			auth.pendingPasswordUser = credentials.email;
		}

		return result;
	}

	endLogin(store, 'IN');

	api.setCredentials( result );

	store.user = {
		id: result.id,
		email: result.email
	}

	return store.user;
}

function endLogin( store, loginStatus ){
	console.log('endLogin', loginStatus);
	store.loginStatus = loginStatus;
	store.loginLoading = false;
	store.federatedLoginLoading = false;
}