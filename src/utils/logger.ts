// import loggerReporter from './loggerReporter';
import store from './logger.store';

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
	let logList = store.logList && store.logList.slice && store.logList.slice() || [];
	let logLine = {
		time: Date.now(),
		type,
		items: Array.prototype.map.call(args, arg => arg.toString())
	};

	logList.unshift( logLine );

	if( logList.lenght > MAX_LENGTH ){
		logList.pop();
	}

	console[method].apply( console, args );
	store.logList = logList;

	// // loggerReporter.report( store, logLine );
}


export {
	log, logWarning, logError
}