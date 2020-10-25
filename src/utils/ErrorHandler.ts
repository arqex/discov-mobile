import { Platform } from 'react-native';
import { getEnv } from '../../environment';
import rejectionTracking from 'promise/setimmediate/rejection-tracking';
import { log } from './logger';

let URL;
let batchedErrors = [];
let router;

getEnv().then( env => {
	URL = env.errorUrl;

	if( batchedErrors.length ){
		sendErrorReport( batchedErrors[0] );
	}
});

let handledFatal: any = false;
export function errorHandler( e, isFatal ) {
	if ( !isFatalTimerExpired( handledFatal ) ){
		return;
	}

	handledFatal = Date.now();
	
	let payload = {
		type: isFatal ? 'mobileError' : 'mobileFatal',
		location: router.location,
		platform: {
			os: Platform.OS,
			version: Platform.Version
		},
		errorMessage: e && e.message,
		error: e
	}
	log( e && e.message || e );
	console.warn( 'ERROR', e.body, payload );
	sendErrorReport( payload );
}

export function initErrorHandler( r ){
	router = r;
	ErrorUtils.setGlobalHandler( errorHandler );
}

let lastErrorSent: string = '';
function sendErrorReport( report ){
	if( !URL ){
		return batchedErrors.push( report );
	}

	if (report.errorMessage === lastErrorSent) {
		return console.log('Error report already sent');
	}

	lastErrorSent = report.errorMessage;
	console.log('Sending error report!');

	fetch( URL, {
		method: 'POST',
		body: JSON.stringify( report )
	});
}

rejectionTracking.enable({
	allRejections: true,
	onUnhandled: (id, error) => {
		const {message, stack} = error;
		const warning =
			`Possible Unhandled Promise Rejection (id: ${id}):\n` +
			(message == null ? '' : `${message}\n`) +
			(stack == null ? '' : stack);
		console.warn(warning);
		errorHandler( error, true );
	}
});

// Ten seconds without sending
const fatalTimeout = 10 * 1000;
function isFatalTimerExpired( timer ){
	if( !timer ) return true;
	return Date.now() - fatalTimeout > timer;
}