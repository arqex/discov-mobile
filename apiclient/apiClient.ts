/* 
	The apiClient is the entry point to the API for the app.
	It acts as a coordinator between:
	- The authClient, the responsible to authenticate the user and get
		the authentication header for making request to the graphql server.
	- The gqlClient, the responsible to manage the user data from the 
		graphql server.
	The apiClient wrap the authentication methods from the authClient,
	and pass the credentials to the gqlClient. It always return the current user
	in their successful authentication calls
*/

import { AuthClient } from './auth/authClient';
import { GqlApi, GqlConfig } from './gql/gqlAPI';
import imageApi from './otherApis/imageApi';
import pushNotificationApi from './otherApis/pushNotificationApi';
import axios, {AxiosRequestConfig} from 'axios';

type RequestInterceptor = (AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

interface ApiUser {
	id: string
	email: string
	isTestUser: boolean,
	userConfirmed: boolean
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
	authStore: any,
	appVersion?: string,
	onRequestError?: (error:any) => boolean
}

type AuthStatus = 'IN' | 'OUT' | 'LOADING'

export class ApiClient {
	config: ApiClientConfig
	gql: GqlApi
	auth: AuthClient
	loginPromise: Promise<ApiLoginResult>

	initialized: boolean = false

	constructor( config: ApiClientConfig ){
		this.config = config;
		this.gql = new GqlApi( this._getGqlConfig() );
		this.auth = new AuthClient( {authStore: config.authStore} )

		axios.interceptors.request.use( request => callCalbacks( this.requestInterceptors, request ) )
		axios.interceptors.response.use(
			response => callCalbacks( this.responseInterceptors, response ),
			error => callCalbacks( this.responseInterceptors, error )
		)
	}

	init(): Promise<ApiLoginResult> {
		if( this.loginPromise ) return this.loginPromise;

		let currentUser = this.getCurrentUser().user;
		if( currentUser ) {
			this.initialized = true;
			return Promise.resolve( {user:currentUser} );
		}

		this.loginPromise = this.auth.getCachedCredentials()
			.then( credentials => {
				delete this.loginPromise;
				this.initialized = true;

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

		// log the gql api out
		this.gql.setConfig(this._getGqlConfig());

		this.loginPromise = this.auth.login( username, password )
			.then( result => {
				delete this.loginPromise;

				// This might authenticate the gql or clean the credentials on error
				this.gql.setConfig( this._getGqlConfig(result.credentials) );

				if(!result.credentials){
					return result;
				}
				return {
					user: result.credentials.user
				}
			})
		;

		return this.loginPromise;
	}

	register( email, password ) {
		// log the gql api out
		this.gql.setConfig(this._getGqlConfig());
		return this.auth.register(email, password)
			.then(result => {
				// This might authenticate the gql or clean the credentials on error
				this.gql.setConfig(this._getGqlConfig(result.credentials));
				return result;
			})
		;
	}

	verifyAccount(email, password, code) {
		// log the gql api out
		this.gql.setConfig(this._getGqlConfig());
		return this.auth.verifyAccount( email, password, code )
			.then(result => {
				// This might authenticate the gql or clean the credentials on error
				this.gql.setConfig( this._getGqlConfig(result.credentials) );
				return result;
			})
		;
	}

	resetPassword(email, code, newPassword) {
		// log the gql api out
		this.gql.setConfig(this._getGqlConfig());
		return this.auth.resetPassword(email, code, newPassword)
			.then( result => {
				// This might authenticate the gql or clean the credentials on error
				this.gql.setConfig(this._getGqlConfig(result.credentials));
				return result;
			})
		;
	}

	logout(){
		this.gql.setConfig( this._getGqlConfig() );
		return this.auth.logout();
	}

	// Other APIs methods
  uploadImage( imageData, progressClbk ){
		return imageApi.uploadImage( this.gql, imageData, progressClbk );
	}

	savePushToken( token ){
		return pushNotificationApi.savePushToken( this.gql, token );
	}

	removePushToken( token ){
		return pushNotificationApi.removePushToken(this.gql, token);
	}

	///////
	// HELPERS
	//////
	_getGqlConfig( credentials?: ApiClientCredentials ): GqlConfig {
		if( !credentials || !credentials.authHeader || !credentials.user ){
			return {
				endpoint: 'NO_CREDENTIALS_SET',
				credentials: {
					authHeader: 'NO_CREDENTIALS_SET'
				}
			}
		}

		const getHeaders = () => this.auth.getCachedCredentials().then( credentials => {
			return {
				Authorization: credentials.authHeader,
				'X-App-Version': this.config.appVersion
			};
		});

		return {
			appVersion: this.config.appVersion,
			onRequestError: this.config.onRequestError,
			endpoint: credentials.user.isTestUser ? this.config.test_endpoint : this.config.endpoint,
			credentials: credentials,
			getHeaders
		};
	}

	requestInterceptors: RequestInterceptor[] = []
	addRequestInterceptor( clbk: RequestInterceptor ){
		this.requestInterceptors.push( clbk );
	}
	removeRequestInterceptor( clbk ){
		removeCallback( this.requestInterceptors, clbk );
	}

	responseInterceptors = []
	addResponseInterceptor( clbk ){
		this.responseInterceptors.push( clbk );
	}
	removeResponseInterceptor( clbk ){
		removeCallback( this.responseInterceptors, clbk );
	}
}


function removeCallback( arr, clbk ){
	let i = arr.length;
	while( i-- > 0 ){
		if( arr[i] === clbk ){
			arr.splice( i, 1 );
		}
	}
}

function callCalbacks( arr, param ): any {
	let result = param;
	arr.forEach( clbk => {
		result = clbk( result );
	});
	return result;
}