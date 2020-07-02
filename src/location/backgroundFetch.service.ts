import BackgroundFetch from "react-native-background-fetch";

let initialized = false;
export default {
	init( clbk: () => Promise<void> ){
		// if( initialized ) return;
		initialized = true;

		const config = {
			minimumFetchInterval: 15
		};

		function onError(err) {
			console.error(err);
		}

		function onEvent( taskId ){
			clbk().then( () => {
				BackgroundFetch.finish( taskId );
			});
		}

		console.log('$$$ Init BG fetch');

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