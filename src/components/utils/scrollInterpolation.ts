const headerOpenHeight = 240;

export default {
	interpolateTo1( value ){
		return value.interpolate({
			inputRange: [0, headerOpenHeight/3, headerOpenHeight/3*2, headerOpenHeight],
			outputRange: [0, 0, 1, 1],
			extrapolate: 'clamp'
		})
	},
	interpolateTo0(value) {
		return value.interpolate({
			inputRange: [0, headerOpenHeight / 3, headerOpenHeight / 3 * 2, headerOpenHeight],
			outputRange: [1, 1, 0, 0],
			extrapolate: 'clamp'
		})
	}
};