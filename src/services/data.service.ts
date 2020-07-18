
import { ApiClient } from '../../apiclient/apiClient';
import authStore from '../utils/authStore';
import { getEnv } from '../../environment';
import { initActions, store } from '../state/appState';
import storeService from '../state/store.service';
import { Platform } from 'react-native';
import services from '.';

let statusChangeClbks = [];
let apiClient: ApiClient;
let actions: any = false;
let lastLoginStatus;
let initPromise;
export const dataService = {
	init() {
		if( initPromise ) return initPromise;

		restoreStore(store);
		storeService.init(store);

		store.off('state', storeListener );
		store.on('state', storeListener );

		initPromise = createApiClient()
			.then( client => {
				apiClient = client;
				return apiClient.init();
			})
			.then( initResult => {
				actions = initActions( apiClient );
				services.init( actions, store );

				if (initResult.user) {
					console.log('CURRENT USER', initResult.user);
					setAuthenticatedUser( store, initResult.user );
				}
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
	getLoginStatus() {
		if( !apiClient ) return 'LOADING';
		
		const authStatus = apiClient.getAuthStatus();

		if (authStatus !== 'IN') {
			lastLoginStatus = authStatus;
		}
		else {
			lastLoginStatus = store.user.account ? 'IN' : 'LOADING';
		}

		return lastLoginStatus;
	}
}

// dataService get always initialized automatically
// on the first import
dataService.init();

function createApiClient() {
	return getEnv().then( env => {
		let endpoint = env.apiUrl;
		if (endpoint.includes('/localhost') && Platform.OS === 'android') {
			// Localhost doesn't work on android emulator
			endpoint = endpoint.replace('localhost', '10.0.2.2');
		}

		store.endpoint = endpoint;

		let apiClient = new ApiClient({
			endpoint,
			test_endpoint: endpoint + 'ci',
			authStore
		});

		return apiClient;
	});
}

function storeListener() {
	backupStore();
	if( lastLoginStatus === 'IN' && !store.user.account ){
		dataService.getLoginStatus(); // This will refresh lastLoginStatus
		clearStores();
	}
}

const BACKUP_KEY = 'userData';
let backupTimer;

function backupStore(){
	if( backupTimer ){
		clearTimeout( backupTimer );
	}

	// Throttle the backup to save stable data
	backupTimer = setTimeout( () => {
		backupTimer = false;
		authStore.storage.setItem(BACKUP_KEY, JSON.stringify( store ) );
	}, 2000);
}

let backupRestored = false;
function restoreStore( store ){
	if( backupRestored ) return;

	authStore.storage.sync()
		.then( () => {
			const strBackup = authStore.storage.getItem( BACKUP_KEY );
			
			if( strBackup ){
				try {	
					let backup = JSON.parse( strBackup );
					if(backup.user && store.user && backup.user.id === store.user.id){
						Object.keys(backup).forEach(key => {
							store[key] = backup[key];
						});
					}
					backupRestored = true;
				}
				catch ( err ) {
					console.error('Cant parse data backup');
				}
			}
		});
	;
}

function clearStores() {
	// First stop any backup pendant
	clearTimeout(backupTimer);

	backupRestored = false;
	authStore.storage.removeItem( BACKUP_KEY );
}

function setAuthenticatedUser( store, user ){
	store.user.email = user.email;
	store.user.id = user.id;
}