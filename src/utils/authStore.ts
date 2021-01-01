import { MemoryStorage } from './StorageHelper';

const TEST_CREDENTIALS_KEY = 'testCredentials';

export default {
	storage: MemoryStorage,

	getCachedCredentials() {
		return MemoryStorage.sync().then( () => {
			let cached = MemoryStorage.getItem(TEST_CREDENTIALS_KEY);
			if( cached ){
				try {
					let credentials = JSON.parse(cached);
					return credentials;
				}
				catch( err ){
					this.clearCache();
				}
			}
		});
	},

	cacheCredentials( credentials ) {
		return MemoryStorage.sync().then( () => MemoryStorage.setItem(TEST_CREDENTIALS_KEY, JSON.stringify(credentials) ) );
	},

	clearCache() {
		return MemoryStorage.sync().then( () => MemoryStorage.removeItem(TEST_CREDENTIALS_KEY) );
	}
}