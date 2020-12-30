
/// <reference path="../types/custom.d.ts" />
import * as React from 'react';
import { StyleSheet, View, BackHandler, StatusBar, Platform, AppState, Dimensions } from 'react-native';
import codePush from "react-native-code-push";
import { dataService } from './services/data.service';
import { Navigator, router } from './react-urlstack';
import createInterceptor from './routes/routeInterceptor';
import {routes} from './routes/routes';
import Menu from './screens/Menu';
import RootLoading from './RootLoading';
import serverMessageListener from './services/serverMessage/serverMessage.listener';
import { initErrorHandler, errorHandler } from './utils/ErrorHandler';
import storeService from './state/store.service';
import appStateService from './services/appState.service';
import { Modal, Bg, ConnectionBadge } from './components'; // The Bg is just to preload the bg images
import BackButtonHandler from './utils/BackButtonHandler';
import locationHandler from './location/location.handler';
import connectionService from './services/connection.service';

globalThis.gql_debug = true;

serverMessageListener.init(router, dataService);

class Root extends React.Component {
  state = {
		showingLoading: this.isLoading(),
		authenticated: false,
		isLogin: true,
		isVerify: false,
		modalOpen: false,
		noConnection: false
	}

	api: any = false;
	actions: any = false;
	navigator: any = false;
	interceptor: any = false;
	federatedLoginLoading = false;
	loadingTimer: any = false;
	discoveriesPopulated: any = false;
	unmounted: boolean = false;
	drawerInitiallyOpen: boolean = true;

	constructor(props) {
		super(props);
		this.navigator = React.createRef();
		this.interceptor = createInterceptor(null, dataService);
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar animated barStyle={this.getStatusBarStyle()} />
				<ConnectionBadge show={ !connectionService.isConnected() } />
				{ this.renderLoadingLayer() }
				{ this.renderNavigator() }
				<Modal onOpen={this._onModalOpen}
					onClose={this._onModalClose}
					backHandler={ BackButtonHandler } />
			</View>
		);
	}

	renderLoadingLayer() {
		if( this.state.showingLoading ) {
			return <RootLoading finished={ !this.isLoading() } />
		}
	}

	renderNavigator() {
		return (
			<Navigator store={ dataService.getStore() }
				actions={dataService.getActions()}
				ref={this.navigator}
				routes={routes}
				interceptor={this.interceptor}
				strategy="node"
				DrawerComponent={ this.getDrawerComponent() }
				drawerInitiallyOpen={ this.drawerInitiallyOpen }
				transitions={{ 0: screenTransition }} />
		)
	}

	canSeeDrawer() {
		let can = (
			this.isLoggedIn() &&
			!storeService.needOnboarding() &&
			!this.isOnboardingRoute()
		);
		
		return can;
	}


	isOnboardingRoute() {
		let path = router.location && router.location.pathname;
		let isOnboarding = path && path.startsWith('/onboarding');

		if( isOnboarding ){
			this.drawerInitiallyOpen = false;
		}

		return isOnboarding;
	}
	
	getDrawerComponent() {
		if( this.canSeeDrawer() ){
			return Menu;
		}
	}
	
	initialize(){
		initErrorHandler(router);

		dataService.init().then( () => {
			this.firstNavigation();
			dataService.getActions().auth.addLoginListener( status => {
				if( status === 'OUT' ){
					setTimeout( () => {
						router.navigate('/');
					}, 300);
				}
			}); 
		});

		locationHandler.init(router);

    let update = () => {
			if( !this.unmounted ) this.forceUpdate();
		}

		let store = dataService.getStore();

		// Refresh on data change
		store.addChangeListener(update);

		// Refresh on connection change
		connectionService.addChangeListener(update);

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor("rgba(0,0,0,0)")
			StatusBar.setTranslucent(true)
		}

		BackButtonHandler.init( BackHandler );
		BackButtonHandler.addListener( () => {
			let isBack = router.back();
			if( isBack ){
				return true;
			}

			let nav = this.navigator.current;
			if( nav && !nav.drawerInstance.state.open ){
				nav.drawer.open();
				return true;
			}

			return false;
		});

		// Signal other listeners about the app has been open
		if( AppState.currentState === 'active') {
			appStateService.emit('active');
		}

		serverMessageListener.setDrawer( this.navigator.current.drawer );
	}

	isLoading() {
		return dataService.getLoginStatus() === 'LOADING';
	}

	_onModalOpen = () => {
		this.setState({modalOpen: true});
	}

	_onModalClose = () => {
		this.setState({modalOpen: false});
	}

	isDrawerInitiallyOpen() {
		return this.isLoggedIn() && !storeService.needOnboarding();
	}

	componentDidCatch(error, errorInfo) {
		console.log( errorInfo );
		errorHandler(error, true);
	}

	componentDidMount() {
		this.initialize();
	}

	componentDidUpdate( prevProps, prevState ){
		this.checkAccountLoaded();
		this.checkResetLoading( prevState );

		if( !this.loadingTimer && this.state.showingLoading && !this.isLoading() ){
			// Stop rendering the loading layer after is animated out
			StatusBar.setBarStyle( this.getStatusBarStyle() );
			this.loadingTimer = setTimeout( () => {
				this.setState({ showingLoading: false });
				this.loadingTimer = false;
			}, 500);
		}
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	checkAccountLoaded() {
		if ( this.isLoading() && dataService.getAuthStatus() === 'IN' ) {
			const { loading, error } = dataService.getStore().accountStatus;
			if ( !loading && !error ) {
				dataService.getActions().account.loadOrCreateAccount()
					.catch( err => {
						if( err && err.message && err.message.indexOf('401') ){
							// We are not logged in
							console.log('ERROR 401');
							dataService.getApiClient().logout()
								.then( () => {
									router.navigate('/');
								})
							;
						}
					})
				;
			}
		}
	}

	checkResetLoading( prevState ) {
		if (!prevState.showingLoading && dataService.getLoginStatus() === 'LOADING') {
			this.setState({showingLoading: true});
		}
	}

	isLoggedIn() {
		return dataService.getLoginStatus() === 'IN';
	}

	getStatusBarStyle() {
		return this.isLoggedIn() ?
			"dark-content" :
			"light-content"
		;
	}

	firstNavigation() {
		// Let the interceptor get the user to the proper route
		router.navigate('/');
	}
}

let toExport;
if (AppState.currentState === 'active') {
	// Only activate codepush when the app is being opened by the user
	const codePushOptions = {
		checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
		installMode: codePush.InstallMode.ON_NEXT_RESUME,
		minimumBackgroundDuration: 5 * 60 // 5 minutes
	}
	toExport = codePush(codePushOptions)(Root);

	console.log('Starting app with codepush');
}
else {
	// If the app has been open by a background process, don't use codepush
	toExport = Root;
	console.log('Starting app without codepush');
}

export default toExport;

const styles = StyleSheet.create({
  container: {
		backgroundColor: '#fff',
		alignItems: 'stretch',
		justifyContent: 'center',
		flex: 1,
	},
	
	loadingContainer: {
		alignItems: 'stretch',
		justifyContent: 'center',
		flex: 1,
	}
});

const screenTransition = {
	styles: function screenTransition( indexes, layout ){
		return {
			translateX: {
				inputRange: [ -1, 0, 1 ],
				outputRange: [ layout.width, 0, (-layout.width) / 3], //-layout.width, -layout.width ]
				extrapolate: 'clamp'
			}
		}
	},
	duration: 300,
  collapsibleDrawer: true,
}