import Auth from '@aws-amplify/auth';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { Hub } from '@aws-amplify/core';
import { uuidTo64 } from "../uuid";

interface AuthClientUser {
	id: string,
	email: string,
	isTestUser: boolean,
	userConfirmed: boolean
}

interface AuthClientCredentials {
	user: AuthClientUser,
	authHeader: string,
	status?: string
}

interface AuthClientError {
	error: any
}

type AuthClientLoginResponse = {
	credentials?: AuthClientCredentials,
	error?: any
}

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
			this.status = credentials ? 'IN' : 'OUT';
		});
	}

	getCachedCredentials(): Promise<AuthClientCredentials | undefined> {
		// Try credentials from test users
		return this.config.authStore.getCachedCredentials()
			.then( testCredentials => {
				if (testCredentials) {
					return testCredentials;
				}

				// Try from amplify
				return Auth.currentSession()
					.then( session => {
						if( !session ) return;

						let idToken = session.getIdToken();
						if (idToken) {
							return {
								user: {
									id: 'ac' + uuidTo64(idToken.payload.sub),
									email: idToken.payload.email,
									isTestUser: false,
									userConfirmed: idToken.payload.email_verified
								},
								authHeader: idToken.getJwtToken()
							}
						}
					})
					.catch( error => {
						if( error !== 'No current user' ){
							throw error;
						}
					})
				;
			})
		;
	}

	login( email, password ): Promise<AuthClientLoginResponse> {
		this.status = 'LOADING';

		if ( isTestUser(email, password) ) {
			this.status = 'IN';
			
			let credentials = {
				user: {
					id: 'ac' + password.replace('ApiToken', ''),
					email,
					isTestUser: true,
					userConfirmed: true
				},
				authHeader: `Bearer ${password}`
			}

			this.config.authStore.cacheCredentials( credentials );
			return Promise.resolve({credentials});
		}

		return Auth.signIn( email, password )
			.then( response => {
				let error = getLoginResponseError(response);

				if( error ){
					this.status = 'OUT';
					return error;
				}

				this.status = 'IN';
				return this.getCachedCredentials().then( credentials => {
					return {credentials};
				});
			})
			.catch( error => {
				this.status = 'OUT';
				return getLoginResponseError({error});
			})
		;
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

	logout() {
		return this.getCachedCredentials()
			.then( credentials => {
				if (!credentials) {
					this.status = 'OUT';
					return { error: false };
				}

				if (credentials.user.isTestUser) {
					this.status = 'OUT';
					this.config.authStore.clearCache();
					return { error: false };
				}

				return Auth.signOut().then( () => {
					this.status = 'OUT';
					return { error: false };
				})
			})
			.catch( error => {
				return { error };
			})
		;
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
		return Auth.forgotPasswordSubmit(email, code, newPassword)
			.then( () => {
				return this.login(email, newPassword);
			})
			.catch (error => {
				return { error }
			})
		;
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
				return this.login( email, password );
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

function getLoginResponseError( response ): AuthClientError | undefined {
	if( !response ) return {error: 'No user'};

	if( response.error ){
		return { error: response.error.code };
	}

	if (response.user) {
		if (response.user.challengeName === 'NEW_PASSWORD_REQUIRED') {
			return { error: 'NewPasswordRequired' };
		}

		if (response.user.userConfirmed === false) {
			return { error: 'UserNotConfirmedException' }
		}
	}
}