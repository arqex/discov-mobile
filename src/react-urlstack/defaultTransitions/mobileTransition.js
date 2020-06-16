export default {
	styles: function mobileDefaultTransition( indexes, layout ){
		return {
			translateX: {
				inputRange: [ -2, -1, 0, 1 ],
				outputRange: [ layout.width, layout.width, 0, 0 ]
			},
			opacity: {
				inputRange: [ -2, -1, 0, .8, 1 ],
				outputRange: [ 0, 1, 1, 0, 0]
			},
			scale: {
				inputRange: [ -1, 0, 1, 2 ],
				outputRange: [ 1, 1, .5, .5]
			}
		}
	},
	duration: 300,
	collapsibleDrawer: true,
	
	// different transitions for modals can be set here
	// modalTransition: { stack, drawer, modal}

	// also transitions for tabs
	// tabTransition: {styles, duration, easing}
}