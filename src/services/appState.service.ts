import {AppState} from 'react-native';

// This service allows to other parts of the app to listen
// when the app goes into the foreground, not only when it was backgrounded before
// also when the app is open for the first time

let clbks: any[] = [];
const appStateService = {
  emit( appState ){
    if( appState === AppState.currentState ){
      clbks.forEach( clbk => clbk( appState ) );
    }
  },

  addChangeListener( clbk ) {
    clbks.push(clbk) 
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

// Start listening to the AppState changes
AppState.addEventListener( 'change', status => appStateService.emit(status) );

export default appStateService;


