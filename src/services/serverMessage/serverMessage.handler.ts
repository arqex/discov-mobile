import messageNotifications from './messageNotifications';
import handlers from './messageHandlers';

let router: any;
let dataService: any;
export default {
  init( r, d ) {
    router = r;
    dataService = d;
  },

  handleMessage( type: string, data?: any ){
    let handler = handlers[type];
    let notification = handler ?
      handler( router, dataService, data ) :
      messageNotifications[type]
    ;

    return {
      notification: poblateNotification( notification, data )
    };
  }
}

function poblateNotification( definition, data ){
  if( !definition ) return false;

  let notification = {};
  Object.keys( definition ).forEach( key => {
    notification[ key ] = parseData( definition[key], data );
  });
  return notification;
}

function parseData( str, data ){
  let toReplace = str.match(/%[^%]+%/g);
  if(!toReplace) return str;

  let parsed = str;
  toReplace.forEach( toReplace => {
    let replacement = data[ toReplace.slice(1, -1) ];
    if( replacement ){
      parsed = parsed.replace( toReplace, replacement );
    }
  })

  return parsed;
}