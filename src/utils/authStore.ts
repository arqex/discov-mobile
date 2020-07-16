import { MemoryStorage } from './StorageHelper';

const TEST_CREDENTIALS_KEY = 'testCredentials';

export default {
	storage: MemoryStorage,

	getCachedCredentials() {
		return MemoryStorage.sync().then( () => MemoryStorage.getItem(TEST_CREDENTIALS_KEY) );
	},

	cacheCredentials( credentials ) {
		return MemoryStorage.sync().then( () => MemoryStorage.setItem(TEST_CREDENTIALS_KEY, JSON.stringify(credentials) ) );
	},

	clearCache() {
		return MemoryStorage.sync().then( () => MemoryStorage.removeItem(TEST_CREDENTIALS_KEY) );
	}
}