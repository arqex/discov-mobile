let actions, store;

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
	init(ac, st) {
		actions = ac;
		store = st;
	},
	setAlert( alert: ActivityAlert ){
		store.alerts[ alert.id ] = alert;
	},
	dismissAlert( alertId ){
		if( store.alerts[alertId] ){
			delete store.alerts[alertId];
		}
	},
	getAlertsMeta(): ActivityAlertsMeta {
		let maxLevel = ActivityAlertLevel.NONE;
		let alerts: ActivityAlert[] = Object.values(store.alerts);
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