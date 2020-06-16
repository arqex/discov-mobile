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


describe('auth Actions', () => {
	describe('login(email, password, clbk)', () => {

		it('should match expected initial state for the store', done => {
			let store: any = {};
			let api = {login: () => wait({error: 'not ok'}), autoLogin: nofn, logout: nofn }
			createActions(store, api);
			
			expect( store.loginLoading ).toBe( true );
			expect( store.loginStatus ).toBe('INIT');
			expect( store.user ).toBeFalsy();

			setTimeout( done, 30 );
		});

		it('should set the loginLoading flag just after call it', done => {
			let store: any = {};
			let api = { 
				login: () => wait({error: 'not ok'}), autoLogin: nofn, logout: nofn
			};
			let authActions = createActions(store, api);

			store.loginLoading = false;

			authActions.login( 'dummy@email.com', 'dummyPassword', null );
			expect( store.loginLoading ).toBe( true );

			setTimeout( done, 30 );
		});

		it('should set the user and the flags the api success', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				login: () => wait( {user: {attributes: res}} ), autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(true) }
			};
			
			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', null )
				.then( () => {
					expect( store.loginLoading ).toBe( false );
					expect( store.loginStatus ).toBe('IN');
					expect( store.user ).toEqual({
						id: res.sub,
						email: res.email
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

			let authActions = createActions(store, api);
			return authActions.login( 'dummy@email.com', 'dummyPassword', null )
				.then( () => {
					expect( store.loginLoading ).toBe( false );
					expect( store.loginStatus ).toBe('OUT');
					expect( store.user ).toBe( false );
				});
			;
		});

		it('should return the account barebones on api success', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				login: () => wait( {user: {attributes: res}} ),
				autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(true) }
			};

			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', null )
				.then( result => {
					expect( result ).toEqual({
						id: res.sub,
						email: res.email
					});
				});
			;
		});
		
		it('should return the error on api fail', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = { login: () => wait( {error: 'NotAuthorizedException'} ), autoLogin: nofn, logout: nofn }

			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', null )
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
				login: () => wait( {user: {attributes: res, challengeName: 'NEW_PASSWORD_REQUIRED'}} ),
				autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(true) }
			};

			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', null )
				.then( result => {
					expect( result.error ).toEqual( { code: 'NewPasswordRequired' } );
					expect( result.email ).toBe('dummy@email.com' );
				})
			;
		});

		it('should return a UserNotConfirmedException error when the user is not confirmed after a register', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				login: () => wait( {user: {attributes: res, userConfirmed: false}} ),
				autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(false) }
			};

			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', null )
				.then( result => {
					expect( result.error ).toEqual( {code: 'UserNotConfirmedException'} );
					expect( result.email ).toBe('dummy@email.com' );
				})
			;
		});

		it('should wait for the clbk function on success', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let clbk = () => {
				return wait({}, 200 ).then( () => store.called = true );
			}

			let api = {
				login: () => wait( {user: {attributes: res}} ),
				autoLogin: nofn, logout: nofn,
				auth: {	isUserVerified: () => wait(true) }
			};

			expect( store.called ).not.toBeDefined();

			let authActions = createActions(store, api);
			return authActions.login( res.email, 'dummyPassword', clbk )
				.then( result => {
					expect( store.called ).toBe( true );
				})
			;
		})
	});


	describe('autoLogin', () => {
		it('should set the loginLoading flag just after call it', done => {
			let store: any = {};
			let api = { 
				autoLogin: () => wait({error: 'not ok'}),
				login: nofn, logout: nofn
			};

			let authActions = createActions(store, api);

			store.loginLoading = false;
			store.autologinLoading = false;

			authActions.autoLogin( null );
			expect( store.loginLoading ).toBe( true );
			expect( store.autologinLoading ).toBe( true );

			setTimeout( done, 30 );
		});

		it('should return the error on api fail', () => {
			let store: any = {};
			let api = {
				autoLogin: () => wait({error: 'NotAuthorizedException'}),
				login: nofn, logout: nofn
			};

			let authActions = createActions(store, api);
			return authActions.autoLogin( null )
				.then( result => {
					expect( store.autologinLoading ).toBe( false );
					expect( store.loginStatus ).toBe('OUT');
					expect( store.user ).toBe( false );
					expect( result.error ).toBe( 'NotAuthorizedException' );
				});
			;
		});	

		it('should return the account barebones on api success', () => {
			let store: any = {};
			let res = {sub: 'dummyId', email: 'dummy@email.com'};
			let api = {
				autoLogin: () => wait({user: {attributes: res}}),
				isUserVerified: () => wait(true)
			};

			let authActions = createActions(store, api);
			return authActions.autoLogin( null )
				.then( result => {
					expect( store.loginLoading ).toBe( false );
					expect( store.loginStatus ).toBe('IN');
					expect( store.user ).toEqual({
						id: res.sub,
						email: res.email
					});
					expect( result ).toEqual({
						id: res.sub,
						email: res.email
					});
				});
			;
		});
	});

	describe('autoLogin', () => {
		it('logout()', () => {
			let store: any = {
				account: {},
				loginStatus: 'IN',
				loginLoading: false
			};
			
			let api = {
				logout: jest.fn( () => wait({}) ),
				login: nofn, autoLogin: nofn
			};

			return createActions(store, api).logout()
				.then( () => {
					expect(store.loginLoading).toBe(false);
					expect(store.loginStatus).toBe('OUT');
					expect(store.user).toBeFalsy();
				})
			;
		})
	})

	describe('register(username, password)', () => {
		it('should return an UsernameExistsException for users already created', () => {
			let user = { email: 'dummy@user.com', pass: 'dummyPass'};

			let store: any = {
				account: {},
				loginStatus: 'IN',
				loginLoading: false
			};

			let error = {code: 'UsernameExistsException' };

			let api = {
				auth: { register: jest.fn( () => Promise.resolve( {error} ) )}
			}

			return createActions(store, api).register( user.email, user.pass, null )
				.then( res => {
					expect( res ).toEqual( {error, email: user.email} );
					expect( api.auth.register.mock.calls[0] ).toEqual([
						user.email, user.pass
					]);
					expect(store.loginLoading).toBe(false);
					expect(store.loginStatus).toBe('OUT');
					expect(store.user).toBe(false);
				})
			;
		})
	})

});