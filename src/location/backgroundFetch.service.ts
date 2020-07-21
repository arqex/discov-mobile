import BackgroundFetch from "react-native-background-fetch";
import { Platform } from "react-native";

let initialized = false;
export default {
	init( clbk: () => Promise<void> ){
		// if (initialized) return console.log('$$$ BG fetch already configured');
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
			return clbk()
				.then(() => {
					console.log('BG TASK FINISHED OK');
					BackgroundFetch.finish( taskId );
				})
				.catch(err => {
					console.log('BG TASK ERROR', err);
					BackgroundFetch.finish(taskId);
				})
			;
		}

		console.log('$$$ Configuring BG fetch');


		BackgroundFetch.status((status) => {
			switch (status) {
				case BackgroundFetch.STATUS_RESTRICTED:
					console.log("BEFORE: BackgroundFetch restricted");
					break;
				case BackgroundFetch.STATUS_DENIED:
					console.log("BEFORE: BackgroundFetch denied");
					break;
				case BackgroundFetch.STATUS_AVAILABLE:
					console.log("BEFORE: BackgroundFetch is enabled");
					break;
			}
		});

		BackgroundFetch.configure(
			config, onEvent, onError
		);

		BackgroundFetch.status((status) => {
			switch (status) {
				case BackgroundFetch.STATUS_RESTRICTED:
					console.log("AFTER: BackgroundFetch restricted");
					break;
				case BackgroundFetch.STATUS_DENIED:
					console.log("AFTER: BackgroundFetch denied");
					break;
				case BackgroundFetch.STATUS_AVAILABLE:
					console.log("AFTER: BackgroundFetch is enabled");
					break;
			}
		});

		if( Platform.OS === 'android' ){
			BackgroundFetch.registerHeadlessTask( e => {
				return clbk()
					.then(() => {
						console.log('BG FETCH FINISHED OK');
						BackgroundFetch.finish( e.taskId );
					})
					.catch( err => {
						console.log('BG FETCH TASK ERROR', err);
						BackgroundFetch.finish(e.taskId);
					})
			});
		}
	}
}