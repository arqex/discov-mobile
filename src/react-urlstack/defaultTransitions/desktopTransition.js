import { Easing } from 'react-native'

export default {
	styles: function desktopMobileTransition( indexes, layout ){
		let leftColumn = indexes.screen ? 400 : 0;
		return {
			width: {
				inputRange: [ -2, -1, 0, 1, 2, 3 ],
				outputRange: [ 0, 0, layout.width - leftColumn, 400, 0, 0]
			},
			
			translateX: {
				inputRange: [ -2, -1, 0, 1, 2 ],
				outputRange: [ layout.width, layout.width, leftColumn, 0, 0]
			}
		}
	},
	easing: Easing.linear,
	duration: 300,

	// different transitions for modals can be set here
	// modalTransition: { stack, drawer, modal}
}