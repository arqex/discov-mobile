import store from "../state/store";

function log( ...args: any[] ) {
	_saveLogLine('log', 'L', arguments);
}

function logWarning( ...args: any[] ) {
	_saveLogLine('warn', 'W', arguments);
}

function logError( ...args: any[] ) {
	_saveLogLine('error', 'E', arguments);
}

const MAX_LENGTH = 300;
function _saveLogLine( method, type, args ){
	if ( !store.apiInitialized ) return;

	let logList = store.logList && store.logList.slice && store.logList.slice() || [];

	logList.unshift({
		time: Date.now(),
		type,
		items: Array.prototype.map.call( args, arg => arg.toString() )
	});

	if( logList.lenght > MAX_LENGTH ){
		logList.pop();
	}

	console[method].apply( console, args );
	store.logList = logList;
}

export {
	log, logWarning, logError
}