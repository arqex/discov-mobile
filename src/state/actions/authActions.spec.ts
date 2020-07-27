import createActions from './authActions';

function wait( response, time = 0, type = 'resolve' ) {
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			if( type === 'resolve' ){
				return resolve( response );
			}
			return reject( response );
		}, time );
	});
}


function nofn(){}

const otherActions = {
	account: {loadOrCreateAccount: () => Promise.resolve() }
}


describe('auth Actions', () => {
	describe('login(email, password)', () => {

		it('should match expected initial state for the store', done => {
			let store: any = {};
			let api = {login: () => wait({error: 'not ok'}), logout: nofn }
			createActions(store, api, otherActions);
			
			expect( store.loginLoading ).toBe( true );
			
			expect( store.user ).toBeFalsy();

			setTimeout( done, 30 );
		});

		it('should set the loginLoading flag just after call it', done => {
			let store: any = {};
			let api = { 
				login: () => wait({error: 'not ok'}), logout: nofn
			};
			let authActions = createActions(store, api, otherActions);

			store.loginLoading = false;

			authActions.login( 'dummy@email.com', 'dummyPassword' );
			expect( store.loginLoading ).toBe( true );

			setTimeout( done, 30 );
		});

		it('should set the user and the flags the api success', () => {
			let store: any = {};
			let user = {id: 'acDummyId', email: 'dummy@email.com', userConfirmed: true};
			let api = {
				login: () => wait( {user} )
			};
			
			let authActions = createActions(store, api, otherActions);
			return authActions.login( user.email, 'dummyPassword' )
				.then( () => {
					expect( store.loginLoading ).toBe( false );
					
					expect( store.user ).toEqual({
						id: user.id,
						email: user.email
					});
				});
			;
		});		

		it('should unset the user and the flags when the login fails', () => {
			let store: any = {};
			let api = {
				login: () => wait( {error: 'dummy_error'} ),
				autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(true) }
			};

			let authActions = createActions(store, api, otherActions);
			return authActions.login( 'dummy@email.com', 'dummyPassword' )
				.then( () => {
					expect( store.loginLoading ).toBe( false );
					
					expect( store.user ).toBe( false );
				});
			;
		});

		it('should return the account barebones on api success', () => {
			let store: any = {};
			let user = {id: 'acDummyId', email: 'dummy@email.com', userConfirmed: true};
			let api = {
				login: () => wait( {user} ),
				logout: nofn
			};

			let authActions = createActions(store, api, otherActions);
			return authActions.login( user.email, 'dummyPassword' )
				.then( result => {
					expect( result ).toEqual({
						id: user.id,
						email: user.email
					 });
				});
			;
		});
		
		it('should return the error on api fail', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = { login: () => wait( {error: 'NotAuthorizedException'} ), logout: nofn }

			let authActions = createActions(store, api, otherActions);
			return authActions.login( res.email, 'dummyPassword' )
				.then( result => {
					expect( result.error ).toBe( 'NotAuthorizedException' );
					expect( result.email ).toBe('dummy@email.com');
				});
			;
		});	

		it('should return a NewPasswordRequired error when we received the proper challengeName', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				login: () => wait( { error: 'NewPasswordRequired' } ),
				auth: {}
			};

			let authActions = createActions(store, api, otherActions);
			return authActions.login( res.email, 'dummyPassword' )
				.then( result => {
					expect( result.error ).toBe( 'NewPasswordRequired' );
					expect( result.email ).toBe('dummy@email.com' );
				})
			;
		});

		it('should return a UserNotConfirmedException error when the user is not confirmed after a register', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				login: () => wait( { error: 'UserNotConfirmedException' } )
			};

			let authActions = createActions(store, api, otherActions);
			return authActions.login( res.email, 'dummyPassword' )
				.then( result => {
					expect( result.error ).toBe( 'UserNotConfirmedException' );
					expect( result.email ).toBe('dummy@email.com' );
				})
			;
		});
	});



	describe('log out', () => {
		it('logout()', () => {
			let store: any = {
				account: {},
				
				loginLoading: false
			};
			
			let api = {
				logout: jest.fn( () => wait({}) ),
				login: nofn
			};

			return createActions(store, api, otherActions).logout()
				.then( () => {
					expect(store.loginLoading).toBe(false);
					
					expect(store.user).toBeFalsy();
				})
			;
		})
	})

	/*
	describe('register(username, password)', () => {
		it('should return an UsernameExistsException for users already created', () => {
			let user = { email: 'dummy@user.com', pass: 'dummyPass'};

			let store: any = {
				account: {},
				
				loginLoading: false
			};

			let error = {code: 'UsernameExistsException' };

			let api = {
				auth: { register: jest.fn( () => Promise.resolve( {error} ) )}
			}

			return createActions(store, api, otherActions).register( user.email, user.pass )
				.then( res => {
					expect( res ).toEqual( {error, email: user.email} );
					expect( api.auth.register.mock.calls[0] ).toEqual([
						user.email, user.pass
					]);
					expect(store.loginLoading).toBe(false);
					
					expect(store.user).toBe(false);
				})
			;
		})
	})
	*/

});