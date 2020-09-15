import { Platform } from "react-native";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import storeService from "../state/store.service";
import { dataService } from "../services/data.service";

let alreadyRegistered = false;

function init( router ){
	PushNotification.configure({
		token: false,
		// (optional) Called when Token is generated (iOS and Android)
		onRegister: function (token) {
			if( alreadyRegistered ) return;

			alreadyRegistered = true;
			console.log( 'Notification token', token );

			dataService.init().then( () => {
				let api = dataService.getApiClient();

				if (dataService.getAuthStatus() === 'IN') {
					api.savePushToken(token);
				}

				dataService.getActions().auth.addLoginListener(status => {
					if (status === 'IN') {
						api.savePushToken(token);
					}
					else {
						// api.removePushToken(token);
					}
				});
			});
		},

		onRegistrationError: function (err) {
			console.log("Push notification error", err.message, err);
		},

		// (required) Called when a remote or local notification is opened or received
		onNotification: function (notification) {
			console.log("NOTIFICATION:", notification);

			if( notification.foreground ){
				console.log('Navigating');
			}

			console.log( router && router.location );
			router.navigate('/myDiscoveries');
			
			notification.finish(PushNotificationIOS.FetchResult.NoData);
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

	PushNotification.requestPermissions();
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
				title: __( 'notifications.singleTitle'),
				message: __( 'notifications.singleMessage', {name: data[0].owner.displayName} ),
				group: type
			});
		}
	},

	createDiscoveriesNofication( discoveries ){
		let count = Math.max( discoveries.length, storeService.getUnseenCount() );

		console.log( 'Count', count );

		this.clear();

		const title = count > 1 ?
			__( 'notifications.multipleTitle', {count} ) :
			__( 'notifications.singleTitle')
		;

		const message = count > 1 ?
			__( 'notifications.multipleMessage', {name: discoveries[0].owner.displayName} ) :
			__( 'notifications.singleMessage', {name: discoveries[0].owner.displayName} )
		;

		return this.open({ title, message });
	}
}