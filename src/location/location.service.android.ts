import { AppRegistry } from 'react-native';

let clbks = [];
AppRegistry.registerHeadlessTask('HeadlessLocationListener', () => async (taskData) => {
	console.log(taskData);
});

export default {
	addListener( clbk ){
		clbks.push( clbk );
	}
}