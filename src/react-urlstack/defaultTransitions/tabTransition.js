import { Easing } from 'react-native'

export default {
	styles: function tabDefaultTransition( indexes, layout ) {
		let scroll = layout.width / 2
		return {
			translateX: {
				inputRange: [-2, -1, 0, 1, 2],
				outputRange: [scroll, scroll, 0, -scroll, -scroll]
			},
			opacity: {
				inputRange: [-2, -1, 0, .8, 1],
				outputRange: [0, 0, 1, 0, 0]
			},
		}
	},
	easing: Easing.linear,
	duration: 300
}