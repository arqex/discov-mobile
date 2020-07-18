import { AuthClient } from './auth/authClient';
import { GqlApi, GqlConfig } from './gql/gqlAPI';

interface ApiUser {
	id: string
	email: string
	isTestUser: boolean
}
interface ApiClientCredentials {
	user: ApiUser
	authHeader: string
}

interface ApiUserResult {
	user?: ApiUser
}

interface ApiLoginResult {
	user?: ApiUser
	error?: string
}

interface ApiClientConfig {
	endpoint: string
	test_endpoint: string,
	authStore: any
}

type AuthStatus = 'IN' | 'OUT' | 'LOADING'

export class ApiClient {
	config: ApiClientConfig
	gql: GqlApi
	auth: AuthClient
	credentials: any
	loginPromise: Promise<ApiLoginResult>

	constructor( config: ApiClientConfig ){
		this.config = config;
		this.gql = new GqlApi( this._getGqlConfig() );
		this.auth = new AuthClient( {authStore: config.authStore} )
	}

	init(): Promise<ApiLoginResult> {
		if( this.loginPromise ) return this.loginPromise;

		let currentUser = this.getCurrentUser().user;
		if( currentUser ) return Promise.resolve( {user:currentUser} );

		this.loginPromise = this.auth.getCachedCredentials()
			.then( credentials => {
				delete this.loginPromise;

				if( !credentials ) return { error: 'NO_CACHED_USER' };

				this.gql.setConfig( this._getGqlConfig(credentials) );

				return { 
					user: credentials.user
				}
			})
		;

		return this.loginPromise;
	}

	getCurrentUser(): ApiUserResult {
		return this.gql.getCurrentUser();
	}

	getAuthStatus(): AuthStatus {
		if( this.loginPromise ) return 'LOADING';
		return this.getCurrentUser().user ? 'IN' : 'OUT';
	}

	login( username, password ): Promise<ApiLoginResult> {
		if( this.loginPromise ) return this.loginPromise;

		this.loginPromise = this.auth.login( username, password )
			.then( result => {
				delete this.loginPromise;

				if( !result.credentials ){
					return result;
				}

				this.gql.setConfig( this._getGqlConfig(result.credentials) );
				return {
					user: result.credentials.user
				}
			})
		;

		return this.loginPromise;
	}

	logout(){
		this.gql.setConfig( this._getGqlConfig() );
		return this.auth.logout();
	}

  uploadImage( imageData ){
    return fetch( this._getUploadEndpoint(), {
      method: 'POST',
      body: JSON.stringify( imageData ),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.credentials.authorizationHeader
      }
    });
	}

	///////
	// HELPERS
	//////
	_getGqlConfig( credentials?: ApiClientCredentials ): GqlConfig{
		if( !credentials ){
			return {
				endpoint: 'NO_CREDENTIALS_SET',
				credentials: {
					authHeader: 'NO_CREDENTIALS_SET'
				}
			}
		}

		return {
			endpoint: credentials.user.isTestUser ? this.config.test_endpoint : this.config.endpoint,
			credentials
		};
	}
	
	_getUploadEndpoint() {
		let currentUser = this.getCurrentUser().user;
		if( !currentUser ) return 'NOT_AUTHENTICATED';

		let endpoint = currentUser.isTestUser ? this.config.test_endpoint : this.config.test_endpoint;
		return endpoint.split('/gql')[0] + '/imageUpload';
	}
}