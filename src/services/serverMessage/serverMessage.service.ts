
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from "react-native";
import { log } from "../../utils/logger";

interface ServerNotification {
  id: string
  data: any
};

let tokenListener: (token:string) => any;
let receivedListener: (notification: ServerNotification) => any;
let pressedListener: (notification: ServerNotification) => any;

let notifications = {};
let alreadyRegistered = false;

const notificationService = {
  init() {
    log('Initializing notification service');
    
    PushNotification.configure({
      token: false,
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        if( alreadyRegistered ) return;

        log( 'Notification token', token );

        tokenListener && tokenListener( token );
  
        alreadyRegistered = true;
      },
  
      onRegistrationError: function (err) {
        log("Push notification error", err.message, err);
      },
  
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (message) {
        if( message.userInteraction ){
          console.log("NOTIFICATION OPEN:", message);
          let notif = message;
          if( message.id && notifications[ message.id ] ){
            notif = notifications[ message.id ];
            delete notifications[ message.id ];
          }
          return pressedListener && pressedListener( notif );
        }
        else if ( message.data ) {
          console.log("NOTIFICATION RECEIVED:", message);
          if( receivedListener ){
            receivedListener( { ...message } );
          }
        }
        
        message.finish(PushNotificationIOS.FetchResult.NoData);
      },
  
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
  
        // process the action
      },
  
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
  
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
  
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  
    // PushNotification.requestPermissions();
  },
  onToken( clbk ){
    tokenListener = clbk;
  },
  onNotificationReceived( clbk ){
    receivedListener = clbk;
  },
  onNotificationPressed( clbk ){
    pressedListener = clbk;
  },
  open( message ){
    let id = message.id || Math.floor( Math.random() * 1000000 );

    let notif: any = {
      title: message.title,
      message: message.message,
    };
    
		if( Platform.OS === 'ios' ){
			notif.userInfo = {id};
		}
		else {
			notif.id = id;
    }

    if( message.image ){
      notif.largeIconUrl = message.image;
    }
    
		console.log( 'Opening notification', notif );
    PushNotification.localNotification( notif );

    notifications[id] = {
      ...message,
      id
    };

		return id;
  },
  close( id?: string ){
    if( id ){
      PushNotification.cancelLocalNotifications({id});
    }
    else {
      PushNotification.cancelAllLocalNotifications();
    }
  },
  getActiveNotifications(){
		return new Promise( resolve => {
			PushNotification.getDeliveredNotifications( resolve );
		});
  }
}

export default notificationService;