import BackgroundFetch from "react-native-background-fetch";
import { Platform } from "react-native";

let initialized = false;
export default {
	init( clbk: () => Promise<void> ){
		if (initialized) return console.log('$$$ BG fetch already configured');
		initialized = true;

		const config = {
			minimumFetchInterval: 15,
			stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true
		};

		function onError(err) {
			console.error(err);
		}

		function onEvent( taskId ){
			return clbk().then( () => {
				BackgroundFetch.finish( taskId );
			});
		}

		console.log('$$$ Configuring BG fetch - iOS');

		BackgroundFetch.configure(
			config, onEvent, onError
		);

		// Optional: Query the authorization status.
		BackgroundFetch.status((status) => {
			switch (status) {
				case BackgroundFetch.STATUS_RESTRICTED:
					console.log("BackgroundFetch restricted");
					break;
				case BackgroundFetch.STATUS_DENIED:
					console.log("BackgroundFetch denied");
					break;
				case BackgroundFetch.STATUS_AVAILABLE:
					console.log("BackgroundFetch is enabled");
					break;
			}
		});

		if( Platform.OS === 'android' ){
			BackgroundFetch.registerHeadlessTask( e => {
				return clbk().then( () => {
					BackgroundFetch.finish( e.taskId );
				});
			});
		}
	}
}