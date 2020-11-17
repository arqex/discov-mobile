import { AppRegistry } from 'react-native';

let clbks = [];
AppRegistry.registerHeadlessTask('HeadlessLocationListener', () => async (taskData) => {
	let data = JSON.parse( taskData.location );

	clbks.forEach( clbk => clbk(data) );
});

export default {
	addListener( clbk ){
		clbks.push( clbk );
	}
}