import { AppRegistry } from 'react-native';
import { log } from '../utils/logger';

let clbks = [];
AppRegistry.registerHeadlessTask('HeadlessLocationListener', () => async (taskData) => {
	if (taskData.location) {
		let data = JSON.parse(taskData.location);
		clbks.forEach(clbk => clbk(data, taskData.source));
	}
	else if( taskData.signal ){
		log(`!!!Signal received: ${ taskData.signal}`);
	}
});

export default {
	addListener( clbk ){
		clbks.push( clbk );
	}
}