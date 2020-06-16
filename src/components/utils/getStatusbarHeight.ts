import { Platform, NativeModules } from 'react-native';

let STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : NativeModules.StatusBarManager.HEIGHT;
if (Platform.OS === 'ios') {
	NativeModules.StatusBarManager.getHeight(bar => {
		console.log('SETTING IOS HEIGHT ', bar.height);
		STATUSBAR_HEIGHT = bar.height;
	});
}

export function getStatusbarHeight(){
	return STATUSBAR_HEIGHT;
}