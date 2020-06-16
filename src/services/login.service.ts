let actions, store;

export const loginService = {

	init(ac, st) {
		actions = ac;
		store = st;
	},

	redirectOnLogin: function( res, router ){
		if (res.error) {
			// User not confirmed coming from the login or register flows
			if (res.error.code === 'UserNotConfirmedException') {
				router.navigate('/auth?content=completeRegistration&email=' + res.email);
				return true;
			}

			// User needs to set a password
			if (res.error.code === 'NewPasswordRequired') {
				router.navigate('/auth?content=forcedPasswordReset&email=' + res.email);
				return true;
			}
		}
		else {
			router.navigate('/myStories');
			return true;
		}

		return false;
	}
}