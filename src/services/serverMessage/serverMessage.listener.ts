import serverMessageHandler from './serverMessage.handler';
import serverMessageService from './serverMessage.service';
import { log } from "../../utils/logger";

let drawer;
const serverMessageListener = {
	init( router, dataService ){
		serverMessageService.onToken( token => {
			dataService.init().then(() => {
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
		});
	
		serverMessageService.onNotificationPressed( serverMessage => {
			if( serverMessage.action ){
				console.log('Navigating because of serverMessage', serverMessage.action );
				drawer && drawer.close();
				router.navigate( serverMessage.action );
			}
			else {
				console.log( 'Notification pressed without an action', serverMessage );
			}
		});
	
		serverMessageService.onNotificationReceived( message => {
			log('Server msg received', message.data.type );
			let result = serverMessageHandler.handleMessage( message.data.type, message.data );
			if( result.notification ){
				serverMessageService.open( result.notification );
			}
		});
		
		serverMessageService.init();
		serverMessageHandler.init( router, dataService );
	},

	setDrawer( dr ){
		drawer = dr;
	}
}

export default serverMessageListener;