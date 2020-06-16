
import {isEmulator} from 'react-native-device-info';

let baseUrlDev = 'https://gql-dev.discov.me/';
let baseUrlLocal = 'http://localhost:3000/';

let dev = {
	useCognito: true,
	apiUrl: `${baseUrlDev}gql`,
	errorUrl: `${baseUrlDev}errorReport`,
	isLocal: true
}

let local = {
	useCognito: false,
	apiUrl: `${baseUrlLocal}gql`,
	errorUrl: `${baseUrlLocal}errorReport`,
	isLocal: false
}

let isLocal;
let promise = isEmulator().then(result => {
	console.log('Is emulator?', result);
	isLocal = result;
})

function getCurrentEnv( isLocal ){
	return dev;
	return isLocal ? local: dev;
}

export function getEnv(){
	if( isLocal !== undefined ){
		return Promise.resolve( getCurrentEnv( isLocal ) );
	}

	return promise.then(() => getCurrentEnv( isLocal ) );
}
