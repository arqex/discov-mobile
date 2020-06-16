import {Easing} from 'react-native'

let stackAndDrawer = {
	styles: {
		translateY: {
			inputRange: [ 0, 1 ],
			outputRange: [ -100, 0 ]
		},
		opacity: {
			inputRange: [ 0, 1 ],
			outputRange: [ 0, 1 ]
		}
	},
	easing: Easing.linear,
	duration: 300
}

export default {
	stack: stackAndDrawer,
	drawer: stackAndDrawer,
	modal:{
		styles: function modalDefaultTransition( indexes, layout ) {
			return {
				translateY: {
					inputRange: [ 0, 1 ],
					outputRange: [ layout.height, 0 ]
				}
			}
		},
		easing: Easing.linear,
		duration: 300
	}
}