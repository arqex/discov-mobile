
import {isEmulator} from 'react-native-device-info';
const pack = require('./package.json');

let baseUrlDev = 'https://gql-dev.discov.me/';
let baseUrlLocal = 'http://localhost:3000/';

let dev = {
	useCognito: true,
	baseUrl: baseUrlDev,
	apiUrl: `${baseUrlDev}gql`,
	errorUrl: `${baseUrlDev}errorReport`,
	isLocal: true,
	appVersion: pack.version
}

let local = {
	useCognito: false,
	baseUrl: baseUrlLocal,
	apiUrl: `${baseUrlLocal}gql`,
	errorUrl: `${baseUrlLocal}errorReport`,
	isLocal: false,
	appVersion: pack.version
}

let isLocal;
let promise = isEmulator().then(result => {
	console.log('Is emulator?', result);
	isLocal = result;
})

function getCurrentEnv( isLocal ){
	if( isLocal ){
		return dev;
		// return local;
	}
	return dev;
}

export function getEnv(){
	if( isLocal !== undefined ){
		return Promise.resolve( getCurrentEnv( isLocal ) );
	}

	return promise.then(() => getCurrentEnv( isLocal ) );
}
