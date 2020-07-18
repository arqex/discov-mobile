const openRoutes = [
	'/', '/auth', '/login', '/register', '/passwordRecovery', '/completeRegistration',
	'/resendCodeEmail', '/newPasswordRequired', '/requestPasswordReset', '/componentGallery', 
]

const DEFAULT_IN_ROUTE = '/myStories'
const DEFAULT_OUT_ROUTE = '/auth'

export default function createInterceptor( environment, dataService ){
	return function( nextLocation ){

		const path = nextLocation.pathname;
		const store = dataService.getStore();
		const loginStatus = dataService.getLoginStatus();

		// Never redirect when we are logging in
		if ( loginStatus === 'LOADING' ){
			return nextLocation;
		}

		let isOpenRoute = openRoutes.indexOf( path ) !== -1;
		if( path === '/componentGallery'){
			return nextLocation;
		}
		if( path === '/' ){
			return loginStatus === 'OUT' ? DEFAULT_OUT_ROUTE : DEFAULT_IN_ROUTE
		}

		if( loginStatus === 'IN' ){
			if( store.user.account && store.user.account.extra.needOnboarding ){
				return path.startsWith('/onboarding') ? path : '/onboarding';
			}
			
			if (isOpenRoute) {
				return DEFAULT_IN_ROUTE
			}
		}
		if( loginStatus === 'OUT' && !isOpenRoute ){
			return DEFAULT_OUT_ROUTE
		}
		
		return nextLocation;
	}
}