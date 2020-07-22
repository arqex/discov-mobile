
/// <reference path="../types/custom.d.ts" />
import * as React from 'react';
import { StyleSheet, View, BackHandler, StatusBar, Platform, AppState } from 'react-native';
import codePush from "react-native-code-push";
import { dataService } from './services/data.service';
import { Navigator, router } from './react-urlstack';
import createInterceptor from './routes/routeInterceptor';
import {routes} from './routes/routes';
import Menu from './screens/Menu';
import RootLoading from './RootLoading';
import notifications from './utils/notifications';
import { initErrorHandler, errorHandler } from './utils/ErrorHandler';
import storeService from './state/store.service';
import { Modal, Bg } from './components'; // The Bg is just to preload the bg images

globalThis.gql_debug = false;

class Root extends React.Component {
  state = {
		showingLoading: this.isLoading(),
		authenticated: false,
		isLogin: true,
		isVerify: false,
		modalOpen: false
	}

	api: any = false;
	actions: any = false;
	navigator: any = false;
	interceptor: any = false;
	federatedLoginLoading = false;
	loadingTimer: any = false;
	discoveriesPopulated: any = false;
	unmounted: boolean = false;

	constructor(props) {
		super(props);
		this.navigator = React.createRef();
		this.interceptor = createInterceptor(null, dataService);
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar animated barStyle={this.getStatusBarStyle()} />
				{ this.renderLoadingLayer() }
				{ this.renderNavigator() }
				<Modal onOpen={this._onModalOpen} onClose={this._onModalClose} />
			</View>
		);
	}

	renderLoadingLayer() {
		if( this.state.showingLoading ) {
			return <RootLoading finished={ !this.isLoading() } />
		}
	}

	renderNavigator() {
		// if( this.state.showingLoading && this.isLoading() ) return;

		return (
			<Navigator store={ dataService.getStore() }
				actions={dataService.getActions()}
				ref={this.navigator}
				routes={routes}
				interceptor={this.interceptor}
				strategy="node"
				DrawerComponent={ this.getDrawerComponent() }
				drawerInitiallyOpen={ this.canSeeDrawer() }
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
		return path && path.startsWith('/onboarding');
	}
	
	getDrawerComponent() {
		if( this.canSeeDrawer() ){
			return Menu;
		}
	}
	
	initialize(){
		initErrorHandler(router);

		dataService.init().then( this.firstNavigation );

    let update = () => {
			if( !this.unmounted ) this.forceUpdate();
		}

		let store = dataService.getStore();

		// Refresh on data change
		store.on('state', update);

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor("rgba(0,0,0,0)")
			StatusBar.setTranslucent(true)
		}

		notifications.init( router );

		BackHandler.addEventListener('hardwareBackPress', () => {
			if( this.state.modalOpen ){
				Modal.close();
				return true;
			}

			let nav = this.navigator.current;
			if( nav && !nav.drawerInstance.state.open ){
				nav.drawer.open();
				return true;
			}
			return false;
		});
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
					.then( this.firstNavigation )
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

export default Root; // toExport;

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
			},
			/*
			opacity: {
				inputRange: [ -2, -1, 0, .8, 1 ],
				outputRange: [ 0, 1, 1, 0, 0]
			}
			*/
		}
	},
	duration: 300,
  collapsibleDrawer: true,
}