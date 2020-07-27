import {Base64} from 'js-base64';

// The same code lives in graphql serve,
// don't modify anything here without doing it in the server
export function uuidTo64( uuid ){
	if(!uuid || !uuid.replace) {
		console.error('uuid is not a string', uuid);
		return '';
	}

	let id = Base64.encode( uuid.replace(/-/, '') )
		.replace(/\+/g, '-')  // Replace + with - (see RFC 4648, sec. 5)
		.replace(/\//g, '_')  // Replace / with _ (see RFC 4648, sec. 5)
		.substring(0, 22)
	;

	return id;
}