import ors from '@arqex/ors'
import { MemoryStorage } from './StorageHelper';

const store = ors({

});

export default store;

store.addChangeListener( backupStore );

const BACKUP_KEY = 'logStore';
let backupRestored = false;
function restoreStore() {
	if( backupRestored ) return;

  MemoryStorage.sync().then( () => {
    const strBackup = MemoryStorage.getItem( BACKUP_KEY );
    
    if( strBackup ){
      try {	
        let backup = JSON.parse( strBackup );
        store.logList = backup.logList;
      }
      catch ( err ) {
        console.error('###### Backup restore ERROR: Cant parse data backup: ' + strBackup );
      }
    }

    backupRestored = true;
  });
}
restoreStore();

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
	MemoryStorage.setItem(BACKUP_KEY, JSON.stringify( store ) );
}
