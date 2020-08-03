import { getEnv } from '../../environment';
import DeviceInfo from 'react-native-device-info'

let logReport = [];
let timer;
let URL;

getEnv().then(env => {
	URL = env.errorUrl;
});

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
			fetch(URL, {
				method: 'POST',
				body: JSON.stringify({
					type: 'log',
					handle: '@' + handle,
					report: logReport
				})
			});
			logReport = [];
			timer = false;
		}, 500);
	}
}
