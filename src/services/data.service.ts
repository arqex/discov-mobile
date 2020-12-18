
import { ApiClient } from '../../apiclient/apiClient';
import authStore from '../utils/authStore';
import { getEnv } from '../../environment';
import { initActions, store } from '../state/appState';
import storeService from '../state/store.service';
import { Platform, Alert } from 'react-native';
import services from '.';
import DeviceInfo from 'react-native-device-info'

let statusChangeClbks = [];
let apiClient: ApiClient;
let actions: any = false;
let lastLoginStatus;
let initPromise;
export const dataService = {
	init() {
		if( initPromise ) return initPromise;

		restoreStore();
		storeService.init(store);

		store.removeChangeListener( storeListener );
		store.addChangeListener( storeListener );

		initPromise = createApiClient()
			.then( client => {
				apiClient = client;
				return apiClient.init();
			})
			.then( initResult => {
				actions = initActions( apiClient );
				services.init( actions, store );

				if (initResult.user) {
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
	addStatusListener( clbk ) {
		statusChangeClbks.push( clbk );
	},
	removeStatusListener( clbk ) {
		let i = clbk.length;
		while( i-- > 0 ){
			if( clbk === statusChangeClbks[i] ){
				statusChangeClbks.splice(i, 1);
			}
		}
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

	authStore.storage.sync()
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

let showingAlert = false;
function checkOutdatedAppError( errors ){
	let i = errors.length;
	while( i-- > 0 ){
		if( errors[i].name === 'outdated_app' && !showingAlert ){
			showingAlert = true;
			dataService.getApiClient().logout();
			Alert.alert('Your app is outdated', errors[i].message + ' Please update your discov app.', [{
				text: 'Ok',
				onPress: () => showingAlert = false
			}] );
		}
	}
}