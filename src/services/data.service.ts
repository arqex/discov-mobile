
import { ApiClient } from '../../apiclient/apiClient';
import authStore from '../utils/authStore';
import { getEnv } from '../../environment';
import { initActions, store } from '../state/appState';
import storeService from '../state/store.service';
import { Platform, Alert } from 'react-native';
import services from '.';
import DeviceInfo from 'react-native-device-info'
import connectionService from './connection.service';
import dataLoaders from '../state/dataLoaders';

let apiClient: ApiClient;
let actions: any = false;
let lastLoginStatus;
let initPromise;
export const dataService = {
	init() {
		if( initPromise ) return initPromise;

		// Initialize main data sources for the app
		// These promises always resolve
		let promises = [
			createApiClient(),
			connectionService.updateConnectionData(),
			restoreStore()
		];

		initPromise = Promise.all( promises )
			.then(( [client]) => {
				apiClient = client;

				storeService.init(store);
				store.removeChangeListener( storeListener );
				store.addChangeListener( storeListener );

				if( connectionService.isConnected() ){
					return apiClient.init();
				}
				else {
					// Offline, we return the user to make the app work as offline
					return {user: store.user};
				}
			})
			.then( initResult => {
				actions = initActions( apiClient );
				dataLoaders.init( actions );
				services.init( actions, store );

				if ( initResult.user ) {
					if( store.user.id && store.user.id !== initResult.user.id ){
						clearStores();
					}
					setAuthenticatedUser( store, initResult.user );
				}
				else if( store.user.id ){
					clearStores();
				}

				console.log('DATA INIT FINISHED');
				store.apiInitialized = true;
			})
			.catch( error => {
				console.log( 'DATA INIT ERROR', error );
			})
		;

		return initPromise;
	},
	isInitialized(){
		return store.apiInitialized;
	},
	getApiClient() {
		return apiClient;
	},
	getStore() {
		return store; 
	},
	getActions() {
		return actions;
	},
	getAuthStatus() {
		// Check for offline mode
		if( !connectionService.isConnected() ){
			if( !store ) return 'LOADING';
			return store.user ? 'IN' : (initPromise ? 'OUT' : 'LOADING');
		}

		if (!apiClient) return 'LOADING';
		return apiClient.getAuthStatus();
	},
	getLoginStatus() {
		const authStatus = this.getAuthStatus();

		if (authStatus !== 'IN') {
			lastLoginStatus = authStatus;
		}
		else {
			lastLoginStatus = store.user.account ? 'IN' : 'LOADING';
		}

		return lastLoginStatus;
	},
	backupStoreNow: backupStoreNow
}

// dataService get always initialized automatically
// on the first import
dataService.init();

function createApiClient() {
	return getEnv().then( env => {
		let endpoint = env.apiUrl;

		if (endpoint.includes('/localhost')){
			if( Platform.OS === 'android' ){
				// Localhost doesn't work on android emulator
				endpoint = endpoint.replace('localhost', '10.0.2.2');
			}
			else if( !DeviceInfo.isEmulatorSync() ){
				endpoint = endpoint.replace('localhost', 'JaviBook.local');
			}
		}

		store.endpoint = endpoint;

		let apiClient = new ApiClient({
			endpoint,
			test_endpoint: endpoint + 'ci',
			authStore,
			appVersion: env.appVersion,
			onRequestError
		});

		apiClient.addResponseInterceptor( result => {
			if( result && result.response && result.response.status === 401 ){
				dataService.getApiClient().logout();
				showAlert('Your session expired', 'Please log in again to use the app.');
			}
			return result;
		});

		return apiClient;
	});
}

function storeListener() {
	backupStore();
}

const BACKUP_KEY = 'userData';
let backupTimer;

function backupStore(){
	if( backupTimer ){
		clearTimeout( backupTimer );
	}

	// Throttle the backup to save stable data
	backupTimer = setTimeout( () => {
		if( !backupRestored ){
			return backupStore();
		}
		backupStoreNow();
	}, 2000);
}

function backupStoreNow() {
	backupTimer = false;
	authStore.storage.setItem(BACKUP_KEY, JSON.stringify( store ) );
	console.log('####### Backup SAVED');
}


let backupRestored = false;
function restoreStore(){
	if( backupRestored ) return;

	return authStore.storage.sync()
		.then( () => {
			const strBackup = authStore.storage.getItem( BACKUP_KEY );
			
			if( strBackup ){
				try {	
					let backup = JSON.parse( strBackup );

					if(backup.user && backup.user.id){
						Object.keys(backup).forEach(key => {
							store[key] = backup[key];
						});

						store.accountStatus = {}; // Clear the account status in case we need to refresh
					}

					console.log(`###### Backup RESTORED`);

				}
				catch ( err ) {
					console.error('###### Backup restore ERROR: Cant parse data backup: ' + strBackup );
				}

				store.status = 'OK';
			}

			backupRestored = true;
		});
	;
}

function clearStores() {
	// First stop any backup pendant
	clearTimeout(backupTimer);

	backupRestored = false;
	authStore.storage.removeItem( BACKUP_KEY );
	console.log(`###### Backup CLEARED`);
}

function setAuthenticatedUser( store, user ){
	store.user.email = user.email;
	store.user.id = user.id;
}

function onRequestError( error ){
	checkOutdatedAppError( error && error.errors || []);
	return false;
}

function checkOutdatedAppError( errors ){
	let i = errors.length;
	while( i-- > 0 ){
		if( errors[i].name === 'outdated_app' ){
			dataService.getApiClient().logout();
			showAlert('Your app is outdated', errors[i].message + ' Please update your discov app.')
		}
	}
}

let showingAlert = false;
function showAlert( title, message ){
	if( showingAlert ) return;
	showingAlert = true;
	Alert.alert(title, message, [{
		text: 'Ok',
		onPress: () => showingAlert = false
	}]);
}