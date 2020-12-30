import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

let connection;
NetInfo.fetch().then( state => {
  connection = getUpdatedConnection( state );
});

let clbks = [];
const connectionService = {
  init( ac, st, sr ){
    NetInfo.addEventListener( state => {
      connection = getUpdatedConnection( state );
      clbks.forEach( clbk => clbk(connection) );
    });
  },

  isConnected(): boolean {
    if( connection ){
      return connection.isInternetReachable === null ? connection.isConnected : connection.isInternetReachable;
    }
    // Optimistically thinks that we have connection
    return true;
  },

  updateConnectionData(): Promise<NetInfoState>{
    return NetInfo.fetch().then( state => {
      connection = getUpdatedConnection( state );
      return connection;
    });
  },

  getStoredConnection() {
    return connection;
  },

  addChangeListener( clbk ){
    clbks.push(clbk);
  },

  removeChangeListener( clbk ){
    let i = clbks.length;
    while( i-- > 0 ){
      if( clbks[i] === clbk ){
        clbks.splice( i, 1 );
      }
    }
  }
}

export default connectionService;

function getUpdatedConnection( connection ){
  return {
    ...connection,
    updatedAt: Date.now()
  }
}