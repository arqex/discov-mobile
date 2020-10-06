import { dataService } from "../data.service";
import notificationParser from './notificationParser';
import notificationService from './notification.service';
import { log } from "../../utils/logger";

const notificationListener = {
	init( router ){
		notificationService.onToken( token => {
			let api = dataService.getApiClient();
	
			if (dataService.getAuthStatus() === 'IN') {
				log('Saving push token');
				api.savePushToken(token);
			}
	
			dataService.getActions().auth.addLoginListener(status => {
				if (status === 'IN') {
					log('Saving push token');
					api.savePushToken(token);
				}
				else {
					// api.removePushToken(token);
				}
			});
		});
	
		notificationService.onNotificationPressed( notification => {
			if( notification.action ){
				console.log('Navigating because of notification', notification.action );
				router.navigate( notification.action );
			}
			else {
				console.log( 'Notification pressed without an action', notification );
			}
		});
	
		notificationService.onNotificationReceived( message => {
			let notification = notificationParser.getNotification( message.data.type, message.data );
			if( notification ){
				notificationService.open( notification );
			}
		});
	
		notificationService.init();
	}
}

export default notificationListener;