
import { ApiClient } from '../../apiclient/apiClient';
import { MemoryStorageNew } from '../utils/StorageHelper';
import { getEnv } from '../../environment';
import { initActions, store } from '../state/appState';
import storeService from '../state/store.service';
import { Platform } from 'react-native';
import services from '.';

let statusChangeClbks = [];
let apiClient: ApiClient;
let authStatus: string = 'INIT';
let locationPermissions: boolean;
let actions: any = false;
let env;

let initPromise;
export const dataService = {
	init() {
		if( initPromise ) return initPromise;
		authStatus = 'LOADING';
		storeService.init(store);

		store.off('state', storeListener );
		store.on('state', storeListener );

		let promises = [
			getEnv(),
			MemoryStorageNew.sync()
		];

		initPromise = Promise.all( promises )
			.then( results => {
				env = results[0];
				apiClient = createAPIClient( env, store.user );
				actions = initActions( apiClient );
				services.init( actions, store );
			})
			.then( () => actions.auth.autoLogin() )
			.then( () => {
				updateStatus( store.loginStatus );
			})
		;

		return initPromise;
	},
	getStatus() {
		return authStatus;
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
	getAPIClient() {
		return apiClient;
	},
	getStore() {
		return store; 
	},
	getActions() {
		return actions;
	}
}

// dataService get always initialized automatically
// on the first import
dataService.init();

function createAPIClient( env, currentUser ){
	if( !env ) return;

	let endpoint = env.apiUrl;
	if( endpoint.includes('/localhost') && Platform.OS === 'android' ){
		// Localhost doesn't work on android emulator
		endpoint = endpoint.replace('localhost', '10.0.2.2');
	}

	store.endpoint = endpoint;
	
	let apiClient = new ApiClient({
		graphql_endpoint: endpoint,
		useCognito: env.useCognito,
		storage: MemoryStorageNew
	});

	console.log('CURRENT USER', currentUser );

	return apiClient;
}

function updateStatus( status ){
	if( status === 'IN' ){
		authStatus = status;
		restoreStore();
		if ( !store.user.account ){
			actions.account.loadUserAccount()
				.then(account => {
					if( account && account.error && account.error.name === 'not_found' ){
						// New user, create an account
						actions.account.createAccount();
					} 
				})
			;
		}
	}
	else if (status === 'INIT') {
		authStatus = status;
	}
	else {
		authStatus = 'OUT';
		// Clear the current apiClient and stores
		apiClient = createAPIClient( env, false );
		clearStores();
	}

	statusChangeClbks.forEach( clbk => clbk( authStatus ) );
}

function storeListener() {
	let currentPermissions = store.locationPermissions && store.locationPermissions.granted;
	if (store.loginStatus !== authStatus || currentPermissions !== locationPermissions ){
		locationPermissions = currentPermissions;
		updateStatus( store.loginStatus );
	}

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
		backupTimer = false;
		MemoryStorageNew.setItem(BACKUP_KEY, JSON.stringify( store ) );
	}, 2000);
}

let backupRestored = false;
function restoreStore(){
	if( backupRestored ) return;

	let strBackup = MemoryStorageNew.getItem( BACKUP_KEY );
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
}

function clearStores() {
	// First stop any backup pendant
	clearTimeout(backupTimer);

	backupRestored = false;
	MemoryStorageNew.removeItem(BACKUP_KEY);
	Object.keys( store ).forEach( key => {
		if( typeof store[key] === 'object' ){
			store[key] = {};
		}
	});
}