import { MemoryStorage } from "../../utils/StorageHelper";

const STORE_KEY = 'notifications';

export default {
  storeNotification( notification ){
    return getNotifications().then( notifications => {
      notifications[notification.id] = notification;
      storeNotifications( notification );
      return notifications;
    })
  },
  popNotification( id ){
    return getNotifications().then( notifications => {
      let notification = notifications[id];
      delete notifications[id];
      storeNotifications( notifications );
      return notification;
    })
  }
}

function getNotifications() {
  return MemoryStorage.sync().then( () => {
    let notifications;
    try {
      notifications = JSON.parse( MemoryStorage.getItem( STORE_KEY ) );
    }
    catch(err) {
      notifications = {}
    }
    return notifications;
  });
}

const STORE_LIMIT = 15 * 24 * 60 * 60 * 1000; // 15 days
function storeNotifications( notifications ){
  let toSave = {};

  // Don't store notifications older than STORE_LIMIT
  let threshold = Date.now() - STORE_LIMIT;
  Object.values( notifications ).forEach( (notification:any) => {
    if( notification.createdAt > threshold ){
      toSave[ notification.id ] = notification;
    }
  });

  MemoryStorage.setItem( STORE_KEY, JSON.stringify(toSave) );
}


