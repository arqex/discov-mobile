import { AuthClient } from './authClient';
import Auth from '@aws-amplify/auth';

jest.mock('@aws-amplify/auth');

describe('AuthClient', () => {

  let credentialsMock = {
    user: {
      id: 'acTUsomebody',
      email: 'somebody@discov.me',
      isTestUser: true,
      userConfirmed: true
    },
    authHeader: 'Bearer AuthHeaederMock'
  };

  describe('Creating client', () => {
    it('should call AWS Auth.configure', () => {
      createClient();
      expect( Auth.configure ).toHaveBeenCalled();
    });

    it('should set the status LOADING', () => {
      let authClient = createClient();
      expect( authClient.status ).toBe('LOADING');
    });

    it('should set the status IN if there are cached credentials', done => {
      let authClient = createClient({
        testCredentials: credentialsMock
      });

      setTimeout( () => {
        expect( authClient.status ).toBe('IN');
        done();
      });
    });

    
    it('should set the status OUT if there are NOT cached credentials', done => {
      let authClient = createClient();

      setTimeout( () => {
        expect( authClient.status ).toBe('OUT');
        done();
      });
    });

    it('should NOT return any cached credentials after creation', () => {
      let authClient = createClient();

      return authClient.getCachedCredentials().then( credentials => {
        expect( credentials ).toBeFalsy();
      });
    });
  });

  describe('login( email, password )', () => {
    it('should always log in with a test user', () => {
      let authClient = createClient();

      return authClient.login( 'test@discov.me', 'TUMockApiToken' )
        .then( result => {
          expect( result.error ).toBeFalsy();
          expect( authClient.status ).toBe('IN');
        })
      ;
    });

    it('should return all credential fields for a test user', () => {
      let authClient = createClient();

      return authClient.login( 'test@discov.me', 'TUMockApiToken' )
        .then( result => {
          expect( result.credentials.user ).toEqual({
            id: 'acTUMock',
            email: 'test@discov.me',
            isTestUser: true,
            userConfirmed: true
          });
          expect( result.credentials.authHeader ).toBe('Bearer TUMockApiToken');
        })
      ;
    });

    it('should return the cached credentials ok after test login', () => {
      let authClient = createClient();
      return authClient.login( 'test@discov.me', 'TUMockApiToken' )
        .then( () => authClient.getCachedCredentials() )
        .then( credentials => {
          expect( credentials.user ).toEqual({
            id: 'acTUMock',
            email: 'test@discov.me',
            isTestUser: true,
            userConfirmed: true
          });
          expect( credentials.authHeader ).toBe('Bearer TUMockApiToken');
        })
      ;
    });

    it('should call AWS signIn with non-test users', () => {
      // @ts-ignore
      Auth.signIn = jest.fn( () => Promise.resolve() );
      let email = 'dummy@email.com';
      let password = 'dummyPassword';

      let authClient = createClient();
      return authClient.login( email, password  )
        .then( () => {
          expect( Auth.signIn ).toHaveBeenCalledWith( email, password )
        })
      ;
    });

    it('should return "No user" error when AWS signIn returns undefined', () => {
      // @ts-ignore
      Auth.signIn = jest.fn( () => Promise.resolve() );
      let email = 'dummy@email.com';
      let password = 'dummyPassword';

      let authClient = createClient();
      return authClient.login( email, password  )
        .then( result => {
          expect( result ).toEqual( {error: 'No user'} );
        })
      ;
    });

    
    it('should return "NewPasswordRequired" error when AWS signIn returns the challenge', () => {
      // @ts-ignore
      Auth.signIn = jest.fn( () => Promise.resolve({
        user: {challengeName: 'NEW_PASSWORD_REQUIRED'}
      }));

      let email = 'dummy@email.com';
      let password = 'dummyPassword';

      let authClient = createClient();
      return authClient.login( email, password  )
        .then( result => {
          expect( result ).toEqual( {error: 'NewPasswordRequired'} );
        })
      ;
    });

    
    it('should return "UserNotConfirmedException" error when AWS signIn returns user not confirmed', () => {
      // @ts-ignore
      Auth.signIn = jest.fn( () => Promise.resolve({
        user: {userConfirmed: false}
      }));

      let email = 'dummy@email.com';
      let password = 'dummyPassword';

      let authClient = createClient();
      return authClient.login( email, password  )
        .then( result => {
          expect( result ).toEqual( {error: 'UserNotConfirmedException'} );
        })
      ;
    });

    // When we sign in users with AWS Auth, it caches the auth session, so we aren't
    // going to test this kind of login, we are going to test the getCachedCredentials instead
  });

  describe( 'getCachedCredentials()', () => {
    // calls for when no user is authenticated and test-user authenticated are already tested
    // try by getting the credentials of non-test users

    it('should return the credentials for non-test users', () => {
      const authClient = createClient({
        awsCredentials: credentialsMock
      });
      const user = credentialsMock.user;

      authClient.getCachedCredentials().then( credentials => {
        expect( credentials ).toEqual({
          user: {
            id: 'acYWNUVXNvbWVib2R5', // Base 64 version
            email: user.email,
            isTestUser: false,
            userConfirmed: user.userConfirmed
          },
          authHeader: credentialsMock.authHeader
        });
      })
    });
  })
});


function createClient( options:any = {} ){
  // @ts-ignore
  Auth.configure = jest.fn( () => Promise.resolve() );

  // @ts-ignore
  Auth.currentSession = jest.fn( () => (
    Promise.resolve( createSessionMock( options.awsCredentials ) ) 
  ));

  return new AuthClient({
    authStore: createAuthStoreMock( options.testCredentials )
  });
}

function createAuthStoreMock( cr ){
  let credentials = cr;

  return {
    getCachedCredentials: function(){
      return Promise.resolve(credentials);
    },
    cacheCredentials: function( cr ){
      credentials = cr;
      return Promise.resolve();
    },
    clearCache: function() {
      credentials = undefined;
      return Promise.resolve();
    },
    storage: createStorageMock()
  }
}

function createStorageMock(){
  let memory = {};

  return {
    setItem: function( key, value ){
      return ( memory[key] = value );
    },
    getItem: function( key ){
      return memory[key]
    },
    removeItem: function( key ){
      return delete memory[key];
    },
    clear: function(){
      return ( memory = {} );
    },
    sync: function() {
      return Promise.resolve( {...memory} );
    }
  }
}


function createSessionMock( credentials ){
  if( !credentials ) return;

  return {
    getIdToken: function() {
      return {
        payload: {
          sub: credentials.user.id,
          email: credentials.user.email,
          email_verified: credentials.user.userConfirmed
        },
        getJwtToken: () => credentials.authHeader
      }
    }
  }
}