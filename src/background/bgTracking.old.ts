import BgGeo from '@mauron85/react-native-background-geolocation';
import { dataService } from '../services/data.service';
import storeService from '../state/store.service';
import { actions } from '../state/appState';
import { AppState } from 'react-native';
import notifications from '../utils/notifications';

let startingPromise, stoppingPromise;

const bgTracking = {
	start: function(){
		if( startingPromise ) return startingPromise;

		return startingPromise = this.checkStatus().then( status => {
			startingPromise = false;
			console.log('BG STATUS - start', status);

			if (status.isRunning) {
				this.stop();
				setTimeout( () => this.start(), 1000 );
			}

			return new Promise((resolve, reject) => {
				console.log('Starting geo tracking');

				BgGeo.configure({
					desiredAccuracy: BgGeo.HIGH_ACCURACY,
					stationaryRadius: 0,
					distanceFilter: 0,
					locationProvider: BgGeo.DISTANCE_FILTER_PROVIDER,
					startOnBoot: true,
					startForeground: true,
					stopOnTerminate: false
				});

				BgGeo.on('location', location => {
					if (AppState.currentState === 'active') {
						actions.discovery.discoverAround(location)
							.then( res => {
								console.log('OLD TRACKING ok', location);
								if (res && res.discoveries && res.discoveries.length ){
									notifications.create('new_discoveries', res.discoveries );
								}
							})
						;
						storeService.storeCurrentPosition(location);
						
					}
					else {
						console.log('Current state no active', location);
					}
				});

				BgGeo.on('start', () => {
					console.log('Bg tracking enabled');
					resolve();
				});

				BgGeo.on('error', error => {
					console.warn('Bg tracking error', error);
					reject(error);
				});

				BgGeo.start();
			});
		});
	},

	stop: function() {
		if( stoppingPromise ) return stoppingPromise;

		return stoppingPromise = this.checkStatus()
			.then(status => {
				stoppingPromise = false;
				console.log('BG STATUS - stop', status);
				if( !status.isRunning ) return;

				return new Promise( resolve => {
					console.log('Stopping geo tracking');
					BgGeo.on('stop', () => {
						resolve();
					});
					BgGeo.stop();
				});
			})
		;
	},

	checkStatus: function() {
		return new Promise( resolve => {
			BgGeo.checkStatus( status => resolve( status ) );
		});
	}
};

// Start the tracking up
if( dataService.getStatus() === 'IN' ){
	bgTracking.start();
}
// Handle login changes
dataService.addStatusListener( status => {
	if (status === 'IN') {
		console.log('geo login');
		bgTracking.start();
	}
	else if (status === 'OUT') {
		console.log('geo logout');
		bgTracking.stop();
	}
});

export default bgTracking;

