import { getEnv } from '../../environment';
import DeviceInfo from 'react-native-device-info'

let logReport = [];
let timer;
let URL;

getEnv().then(env => {
	URL = env.errorUrl;
});

let waitTime = 100;

export default {
	report(store, logLine) {
		let handle = store.user.account && store.user.account.handle;
		if( !handle ) return;

		logReport.push( JSON.stringify(logLine) );

		if (timer) {
			console.log('CLEARING TIMER');
			clearTimeout( timer );
		}

		timer = setTimeout(() => {
			let options = {
				method: 'POST',
				body: JSON.stringify({
					type: 'log',
					handle: '@' + handle,
					report: logReport
				})
			};
			
			fetch(URL, options)
				.then( res => {
					waitTime = 1000;
				} )
				.catch( err => {
					// waitTime = 10 * 60 * 1000;
				})
			;
			logReport = [];
			timer = false;
		}, waitTime);
	}
}
