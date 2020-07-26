import { Platform } from "react-native";

interface BBHandler {
  init: ( BackHandler: any ) => void
  addListener: ( listener: () => boolean ) => void
  removeListener: ( listener: () => boolean ) => void,
  clearListeners: () => void
}

let stack = [];
const emptyListener = function(listener){};

let BackButtonHandler: BBHandler = {
  init: function( BackHandler ){
    // This way we can test different environments by setting Platform
    // and calling init afterwards
    if( Platform.OS !== 'android' ) {
      // If we aren't android we do nothing
      this.addListener = emptyListener;
      this.removeListener = emptyListener;
      return;
    }

    BackHandler.addEventListener( 'hardwareBackPress', onBackPress );

    this.addListener = function( listener ){
      stack.push( listener );
    },

    this.removeListener = function ( listener ){
      let i = stack.length;
      while( i-- ){
        if( stack[i] === listener ){
          stack.splice( i , 1 );
          return;
        }
      }
    }
  },
  addListener: emptyListener, // See implementation in init method
  removeListener: emptyListener, // See implementation in init method
  clearListeners: function() {
    stack = [];
  }
};

function onBackPress(){
  let i = stack.length;

  while( i-- ){
    if( stack[i]() ){
      return true;
    }
  }

  return false;
}

export default BackButtonHandler;