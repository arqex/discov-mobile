import { Platform } from "react-native";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import storeService from "../state/store.service";

// These are special characters, not whitespaces. With them we mark types of
// notifications and then we can group them.
const invisible = {
	new_discoveries: '‏‏‎ ‎',
}

function init( router ){
	PushNotification.configure({
		// (optional) Called when Token is generated (iOS and Android)
		onRegister: function (token) {
			console.log("TOKEN:", token);
		},

		// (required) Called when a remote or local notification is opened or received
		onNotification: function (notification) {
			console.log("NOTIFICATION:", notification);

			if( notification.foreground ){
				console.log('Navigating');
			}

			console.log( router && router.location );
			router.navigate('/myDiscoveries');

			// required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
			if( Platform.OS === 'ios' ){
				notification.finish(PushNotificationIOS.FetchResult.NoData);
			}
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
		requestPermissions: Platform.OS === 'ios',
	});
}


export default {
	init,
	open: function(options){
		let id = Math.floor( Math.random() * 1000000 );
		let ops = {
			...options
		};
		if( Platform.OS === 'ios' ){
			ops.userInfo = {id};
		}
		else {
			ops.id = id;
		}

		console.log( 'Opening notification', ops );
		PushNotification.localNotification( ops );
		return id;
	},

	getCurrent: function() {
		return new Promise( resolve => {
			PushNotification.getDeliveredNotifications( resolve );
		});
	},

	clear: function(){
		console.log( 'Closing notifications' );
		PushNotification.removeAllDeliveredNotifications();
	},

	create: function( type, data ){
		if(type === 'new_discoveries'){
			// console.log('Notification', data)
			return this.open({
				title: 'You have a new discovery!' + invisible[ type ],
				message: `You found a story from ${data[0].owner.displayName}.`,
				group: type
			});
		}
	},

	createDiscoveriesNofication( discoveries ){
		let count = Math.max( discoveries.length, storeService.getUnseenCount() );

		console.log( 'Count', count );

		this.clear();

		const title = count > 1 ?
			`You have ${ count } new discoveries!` :
			'You have a new discovery!'
		;

		const message = count > 1 ?
			`From ${discoveries[0].owner.displayName} and others.` :
			`You found a story from ${discoveries[0].owner.displayName}.`
		;

		return this.open({ title, message });
	}
}