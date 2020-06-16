export interface ScreenProps {
	router: any,
	location: any,
	actions: any,
	store: any,
	drawer: {open: Function, close: Function},
	layout: {
		height: Number,
		width: Number,
		x: Number,
		y: Number
	}
}