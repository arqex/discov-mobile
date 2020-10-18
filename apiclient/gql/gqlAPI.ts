
/* global globalThis */
import API, { graphqlOperation } from '@aws-amplify/api';
import GqlMethods from './gqlMethods';

var glob;
if( typeof globalThis !== 'undefined' ){
  glob = globalThis;
}
else {
  glob = {}
}

interface RunnableStatement {
  run: (params: any) => Promise<any>,
  getBody: (params: any ) => any,
  then: (params: any ) => any,
}

export interface GqlCredentials {
  user?: any,
  authHeader: string
}

export interface GqlConfig {
  endpoint?: string
  credentials?: GqlCredentials,
  appVersion?: string,
  onRequestError?: (error:any) => boolean,
  getHeaders?: () => Promise<any>
}

export class GqlApi extends GqlMethods {
  config: GqlConfig

  constructor( options: GqlConfig ){
    super();
    this.config = options;
  }

  setConfig( options: GqlConfig ){
    ['endpoint', 'credentials', 'appVersion', 'onRequestError', 'getHeaders'].forEach( key => {
      if( options[key] ){
        this.config[key] = options[key];
      }
    });
  }

  getCurrentUser(){
    if( !this.config.credentials ) return {user: false};

    return {
      user: this.config.credentials.user
    }
  }

  makeRunnable( statement: string ): RunnableStatement {
    // Extract the param name from the statement
    let paramName: any = statement.match((/\$([^:]+)/));
    
    if( paramName ){
      paramName = paramName[1];
    }

    // Let's hoist the config
    let config = this.config;

    return {
      getBody: function( param: any ){
        // Convert the single parameter into an object
        // with the right key
        let paramObj: any = {};
        if( paramName ){
          paramObj[ paramName ] = param;
        }

        return graphqlOperation( statement, paramObj );
      },

      then: function() {
        throw new Error('Cant use then in a graphql statement without calling `run` before: ' + statement );
      },

      run: async function( param: any ){
        if (!config.endpoint || !config.endpoint.startsWith('http')) {
          console.log('GQL ENDPOINT NOT SET', statement);
          return Promise.reject('GQL ENDPOINT NOT SET');
        }

        let body = this.getBody(param);

        API.configure({
          graphql_endpoint: config.endpoint,
          graphql_headers: config.getHeaders
        });
        
        try {
          const res: any = await API.graphql( body );
          
          if( glob.gql_debug ){
            console.log({
              endpoint: config.endpoint,
              'gql request': body,
              'gql response': res.data,
              'authorizer': getAuthorizerType( config.credentials.authHeader )
            });
          }

          let keys = Object.keys( res.data )
          return res.data[ keys[0] ];
        }
        catch (err) {
          console.log('ERROR', err);

          let ajaxData = {
            endpoint: config.endpoint,
            authorization: config.credentials.authHeader,
            'gql request': body,
            'gql error': err,
            'authorizer': getAuthorizerType(config.credentials.authHeader)
          };
          
          if( glob.gql_debug ){
            console.log( ajaxData );
          }

          if( err && err.errors && err.errors.length ){
            if( err.errors.length > 1 ){
              console.log( 'There are more than 1 error in the gqlRequest', err.errors );
            }

            if( config.onRequestError ){
              config.onRequestError( err );
            }
  
            return {
              data: err.data,
              error: err.errors[0],
              ajax: ajaxData
            };
          }

          return { error: err, ajax: ajaxData };
        }
      }
    }
	}
}


function getAuthorizerType( header ){
  return header.length < 50 ? 'custom' : 'cognito'
}