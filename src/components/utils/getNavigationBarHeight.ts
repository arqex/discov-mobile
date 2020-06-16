import { Dimensions, Platform } from 'react-native'

const d = Dimensions.get("window")
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

const NAVBAR_HEIGHT = isX ? 20 : 0;

export function getNavigationBarHeight(){
	return NAVBAR_HEIGHT;
}