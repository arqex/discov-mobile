
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
  credentials?: GqlCredentials
}

export class GqlApi extends GqlMethods {
  config: GqlConfig

  constructor( options: GqlConfig ){
    super();
    this.config = options;
  }

  setConfig( options: GqlConfig ){
    if( options.endpoint ){
      this.config.endpoint = options.endpoint;
    }
    if( options.credentials ){
      this.config.credentials = options.credentials;
    }
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
        let body = this.getBody(param);

        API.configure({
          graphql_endpoint: config.endpoint,
          graphql_headers: async () => ({
            Authorization: config.credentials.authHeader
          })
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
          
          if( glob.gql_debug ){
            console.log({
              endpoint: config.endpoint,
              authorization: config.credentials.authHeader,
              'gql request': body,
              'gql error': err,
              'authorizer': getAuthorizerType( config.credentials.authHeader )
            });
          }

          if( err && err.errors && err.errors.length ){
            if( err.errors.length > 1 ){
              console.log( 'There are more than 1 error in the gqlRequest', err.errors );
            }
  
            return {
              data: err.data,
              error: err.errors[0]
            };
          }

          return { error: err };
        }
      }
    }
	}
}


function getAuthorizerType( header ){
  return header.length < 50 ? 'custom' : 'cognito'
}












