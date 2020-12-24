let actions, store, services;

export enum ActivityAlertLevel {
	NONE = 0,
	INFO = 3,
	WARNING = 6,
	ERROR = 10
}

export interface ActivityAlert {
	id: string,
	title: string,
	description: string,
	level: ActivityAlertLevel,
	dismissable: boolean,
	action: string
}

export interface ActivityAlertsMeta {
	count: number,
	maxLevel: ActivityAlertLevel
}

export const alertService = {
	init(ac, st, sr) {
		actions = ac;
		store = st;
		services = sr;
	},
	setAlert( alert: ActivityAlert ){
		store.alerts[ alert.id ] = alert;
	},
	dismissAlert( alertId ){
		if( store.alerts[alertId] ){
			delete store.alerts[alertId];
		}
	},
	getAlerts() {
		return { ...store.alerts, ...getDerivedAlerts() };
	},
	getAlertsMeta(): ActivityAlertsMeta {
		let maxLevel = ActivityAlertLevel.NONE;
		let alerts: ActivityAlert[] = Object.values(this.getAlerts());
		alerts.forEach( alert => {
			if( maxLevel < alert.level ){
				maxLevel = alert.level;
			}
		});

		return {
			count: alerts.length,
			maxLevel
		};
	}
}

function getDerivedAlerts(){
	return {
		...getLocationPermissionAlerts( services.location.getStoredPermissions() )
	};
}

const fgPermissionAlert: ActivityAlert = {
	id: 'FG_LOCATION',
	title: 'Location access is not enabled',
	description: 'Allow location access to start discovering stories from your friends',
	level: ActivityAlertLevel.ERROR,
	action: '/fgLocationPermission',
	dismissable: false
}
const bgPermissionAlert: ActivityAlert = {
	id: 'BG_LOCATION',
	title: 'Passive discovering not enabled',
	description: 'Allow location access to discover stories while Discov is in the background',
	level: ActivityAlertLevel.ERROR,
	action: '/bgLocationPermission',
	dismissable: false
}

function getLocationPermissionAlerts( {foreground, background} ){
	if( foreground && !foreground.isGranted ){
		return {
			[fgPermissionAlert.id]: fgPermissionAlert
		};
	}
	else if (background && !background.isGranted && !isWaitingForRequestAgain( foreground )) {
		return {
			[bgPermissionAlert.id]: bgPermissionAlert
		};
	}
	return {};
}

const REQUEST_WAIT_TIME = 5 * 60 * 1000; // Five minutes to no overwhelm the user
function isWaitingForRequestAgain( permission ){
	if( !permission ) return false;
	return permission.requestedAt + REQUEST_WAIT_TIME > Date.now(); 
}