import { GqlApi } from './gql/gqlAPI';

interface ApiClientCredentials {
	email: string
	isTestUser: boolean
	authHeader: string
}

interface ApiClientConfig {
	endpoint: string
	test_endpoint: string
	credentials?: ApiClientCredentials
}

export class ApiClient {
	config: ApiClientConfig
	gql: GqlApi
	credentials: any

	constructor( config: ApiClientConfig ){
		this.config = config;
		this.gql = new GqlApi( this._getGqlConfig( config.credentials ) );
	}

	setCredentials( credentials ){
		this.credentials = credentials;
		if( credentials ) {
			this.gql.setConfig( this._getGqlConfig( credentials ) );
		}
	}

  async uploadImage( imageData ){
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
	_getGqlConfig( credentials?: ApiClientCredentials ){
		if( !credentials ){
			return {
				endpoint: 'NO_CREDENTIALS_SET',
				authHeader: 'NO_CREDENTIALS_SET'
			}
		}

		return {
			endpoint: credentials.isTestUser ? this.config.test_endpoint : this.config.endpoint,
			authHeader: credentials.authHeader
		};
	}
	
	_getUploadEndpoint() {
		let endpoint = this._getGqlConfig( this.config.credentials ).endpoint;
		return endpoint.split('/gql')[0] + '/imageUpload';
	}
}