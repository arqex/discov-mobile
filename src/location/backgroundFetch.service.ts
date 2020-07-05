import BackgroundFetch from "react-native-background-fetch";

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
			clbk().then( () => {
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
	}
}