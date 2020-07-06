
/// <reference path="../types/custom.d.ts" />
import React, {Component} from 'react';
import { StyleSheet, View, BackHandler, StatusBar, Platform } from 'react-native';
import codePush from "react-native-code-push";
import { dataService } from './services/data.service';
import { Navigator, router } from './react-urlstack';
import createInterceptor from './routes/routeInterceptor';
import {routes} from './routes/routes';
import Menu from './screens/Menu';
import RootLoading from './RootLoading';
import notifications from './utils/notifications';
import { initErrorHandler, errorHandler } from './utils/ErrorHandler';

import locationTracking from  './location/location.tracking';
import storeService from './state/store.service';
import { Modal } from './components';

globalThis.gql_debug = false;

class Root extends Component {
  state = {
		showingLoading: this.isLoading( dataService.getStore() ),
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

	constructor(props) {
		super(props);
		this.initialize();
		this.navigator = React.createRef();
	}

  render() {   
		let store = dataService.getStore();
		let loadingLayer;

		if ( this.state.showingLoading ) {
			loadingLayer = this.renderLoading( store );
			if( this.isLoading( store ) ){
				return loadingLayer;
			}
		}

    return (
      <View style={ styles.container }>
				<StatusBar animated barStyle={ this.getStatusBarStyle() } />
				{ loadingLayer }
        <Navigator store={ store }
          actions={ this.actions }
					ref={ this.navigator }
					routes={ routes }
					interceptor={ this.interceptor }
					strategy="node"
					DrawerComponent={ this.getDrawerComponent() }
					drawerInitiallyOpen={ this.isDrawerInitiallyOpen() }
          transitions={{0: screenTransition}} />
				<Modal onOpen={ this._onModalOpen } onClose={ this._onModalClose } />
      </View>
    );
  }

  renderLoading( store ) {
    return (
			<RootLoading finished={ !this.isLoading( store ) } />
    );
	}
	
	getDrawerComponent() {
		if (!this.isLoggedIn()) return;

		if( storeService.needOnboarding() ) return;

		return Menu;
	}

	isOnboarding() {
		// console.log( router.location );
		// return router.location.pathname === '/onboarding';
	}
	
	initialize(){
		initErrorHandler(router);

    let update = () => {
      this.forceUpdate();
		}

		this.populateMethodsFromService();

		let store = dataService.getStore();

		// Refresh on data change
		store.on('state', update);

		// Listen to status changes
		dataService.addStatusListener( this._onAuthChange );
		
		this.interceptor = createInterceptor(null, store);

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

	isLoading( store ) {
		let status = dataService.getStatus();

		if( status === 'INIT' || status === 'LOADING' ){
			return true;
		}

		let account = store.user.account;

		if( status === 'IN' && (!account || !account.createdAt) ) {
			return true;
		}

		return false;
	}

	_onAuthChange = status => {
		if (status === 'IN') {
			this.populateMethodsFromService();

			// We are poblating discoveries to show the
			// unseen counter in the menu
			if ( !this.discoveriesPopulated ){
				this.discoveriesPopulated = true;
				this.actions.discovery.loadUserDiscoveries();
			}

			// We need to know if we have access to the location
			locationTracking.isPermissionGranted();
		}
		else if( status === 'OUT' ) {
			this.discoveriesPopulated = false;
			this.populateMethodsFromService();
		}
	}

	_onModalOpen = () => {
		this.setState({modalOpen: true});
	}

	_onModalClose = () => {
		this.setState({modalOpen: false});
	}

	/*
	initializeUserData() {
		if (!dataService.getStore().user.account) {
			this.actions.account.loadUserAccount()
				.then( res => {
					if( res && res.error === 'not_found' ){
						return this.actions.account.createAccount();
					}
					return res;
				})
			;
		}
	}
	*/

	isDrawerInitiallyOpen() {
		let path = router.location && router.location.pathname;
		return (
			this.isLoggedIn() &&
			!storeService.needOnboarding() &&
			(!path || !path.startsWith('/onboarding') )
		);
	}

	populateMethodsFromService(){
		this.api = dataService.getAPIClient();
		this.actions = dataService.getActions();
	}

	componentDidCatch(error, errorInfo) {
		console.log( errorInfo );
		errorHandler(error, true);
	}

	componentDidMount() {
		setTimeout( () => {
			this.forceUpdate()
		}, 3000)
	}

	componentDidUpdate(){
		if( !this.loadingTimer && this.state.showingLoading && !this.isLoading( dataService.getStore() ) ){

			console.log('Loading finished');
			this.loadingTimer = setTimeout( () => {
				console.log('Stop showing loading');
				this.setState({ showingLoading: false });
			}, 500);
		}
	}

	isLoggedIn() {
		return dataService.getStore().loginStatus === 'IN';
	}

	getStatusBarStyle() {
		return this.isLoggedIn() ?
			"dark-content" :
			"light-content"
		;
	}
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 5*60 // 5 minutes
}
export default codePush(codePushOptions)(Root);

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
				inputRange: [ -2, -1, 0, 1, 2 ],
				outputRange: [ layout.width, layout.width, 0, 0, 0 ] //-layout.width, -layout.width ]
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