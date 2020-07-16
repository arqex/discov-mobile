import Auth from '@aws-amplify/auth';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { Hub } from '@aws-amplify/core';

// This promise is set when login by google
let federatedLoginPromise: any = false;
Hub.listen("auth", async ({ payload: { event, data } }) => {
	if (federatedLoginPromise && event === 'signIn') {
		let user = data;
		user.attributes = await getAttributes(user);
		federatedLoginPromise({ user });
	}
});

export class AuthClient {
	config: any
	status: 'LOADING' | 'IN' | 'OUT' | 'REQUIRE_NEW_PASSWORD' | 'VERIFY_CONTACT'

	constructor( config: any ){
		this.config = config;

		Auth.configure({
			region: 'eu-west-1',
			userPoolId: 'eu-west-1_4zR6Djhg4',
			userPoolWebClientId: '6etcrn3afn70usdim0ddlh3nrt',
			storage: config.authStore.storage,

			oauth: {
				domain: 'discovprueba.auth.eu-west-1.amazoncognito.com',
				scope: ['email', 'profile', 'openid'],
				redirectSignIn: 'exp://127.0.0.1:19000/--/',
				redirectSignOut: 'exp://127.0.0.1:19000/--/',
				responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
			}
		});

		this.status = 'LOADING';
		this.getCachedCredentials().then( credentials => {
			if( !credentials ){
				this.status = 'OUT'
			}
			else if( credentials.status ){
				this.status = credentials.status;
			}
			else {
				this.status = 'IN';
			}
		});
	}

	async getCachedCredentials() {
		// Try credentials from test users
		const testCredentials = await this.config.authStore.getCachedCredentials();
		if( testCredentials ){
			return testCredentials;
		}

		// Try from amplify
		let idToken = (await Auth.currentSession()).getIdToken();
		if( idToken ){
			return {
				email: idToken.payload.email,
				authHeader: await idToken.getJwtToken()
			}
		}
	}

	async login( email, password ){
		this.status = 'LOADING';

    if ( isTestUser(email, password) ) {
			this.status = 'IN';
			
			let credentials = {
				email,
				authHeader: `Bearer ${password}`,
				isTestUser: true
			}
			this.config.authStore.cacheCredentials( credentials );
			return credentials;
		}

		try {
			let user = await Auth.signIn( email, password );
			if( user ){
				this.status = 'IN';
				return await this.getCachedCredentials();
			}
			else {
				this.status = 'OUT';
			}
		}
		catch (error) {
			this.status = 'OUT';
			return {error};
		}
	}

	async register(email, password) {
		const payload = {
			username: email,
			password,
			attributes: { email }
		};

		this.status = 'LOADING';
		return Auth.signUp( payload )
			.then( user => {
				this.status = 'IN';
				return { error: false, user }
			})
			.catch(err => {
				this.status = 'OUT';
				return { error: err }
			})
		;
	}

	async federatedLogin() {
		Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
		this.status = 'LOADING';
		return new Promise(resolve => {
			federatedLoginPromise = resolve;
		});
	}

	async logout() {
		let credentials = await this.getCachedCredentials();
		
		this.status = 'OUT';

		if( !credentials ){
			return { error: false };
		}

		if( credentials.isTestUser ){
			this.config.authStore.clearCache();
			return { error: false };
		}

		try {
			await Auth.signOut();
			return { error: false };
		}
		catch( error ) {
			return {error};
		}
	}

	async resendVerificationEmail(email) {
		try {
			await Auth.resendSignUp(email);
			return { error: false };
		}
		catch( error ) {
			return { error }
		}
	}

	async requestPasswordReset(email) {
		try {
			await Auth.forgotPassword(email);
			return { error: false };
		}
		catch( error ) {
			return { error }
		}
	}

	async resetPassword(email, code, newPassword) {
		try {
			let user = await Auth.forgotPasswordSubmit(email, code, newPassword);
			return { error: false, user };
		}
		catch (error) {
			return { error }
		}
	}

	updateUserAttribute(attributes) {
		return Auth.currentAuthenticatedUser()
			.then(user => {
				return Auth.updateUserAttributes(user, attributes)
			})
			.then(result => {
				return { error: false, result }
			})
			.catch(err => {
				return { error: err }
			})
		;
	}

	verifyAccount(email, password, code) {
		this.status = 'LOADING';

		return Auth.confirmSignUp( email, code )
			.then( res => {
				console.log( res );
			})
			.then( () => {
				this.status = 'IN';

				// We are coming from the login flow, and the user is out
				if( password ){
					return this.login( email, password );
				}

				// User is logged in because we come from the register flow
				return this.getCachedCredentials();
			})
			.catch( error => {
				this.status = 'OUT';
				return { error }
			})
		;
	}

	async completeNewPassword(user, newPassword) {
		this.status = 'LOADING';
		
		try {
			await Auth.completeNewPassword(user, newPassword, undefined);
			this.status = 'IN';
			return await this.getCachedCredentials();
		}
		catch (error) {
			this.status = 'OUT';
			return {error};
		}
	}
}


function isTestUser(email, password) {
	return email.match(/@discov.(me|net)$/) && password.startsWith('TU');
}

async function getAttributes(user) {
	// currentUserInfo doesn't work with google login
	if (user.username && user.username.indexOf('Google') === 0) {
		const info = (await Auth.currentSession()).getIdToken().payload;
		return {
			sub: info.sub,
			email: info.email,
			nickname: info.givenName ? `${info.givenName} ${info.familyName}` : info.email.split('@')[0]
		}
	}
	else if (user.attributes) {
		return user.attributes;
	}

	let userInfo = await Auth.currentUserInfo();
	if (userInfo && userInfo.attributes) {
		return userInfo.attributes;
	}

	return {};
}