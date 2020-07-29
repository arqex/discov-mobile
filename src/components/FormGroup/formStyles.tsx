import styleVars from '../styleVars';

export default {
	label: {
		opacity: 0,
		height: 15,
		transform: [{translateY: 2}],
		overflow: 'visible',
		fontWeight: styleVars.fontWeight.bold,
		textTransform: 'uppercase',
		fontSize: 13
	},
	labelActive: {
		opacity: .8,
	},
	labelFocused: {
		opacity: .9
	},
	labelDisabled: {

	},
	labelError: {
		color: styleVars.colors.red
	},
	caption: {
		fontSize: 14
	},
	captionActive: {

	},
	captionFocused: {

	},
	captionDisabled: {

	},
	captionError: {
		color: styleVars.colors.red
	},
	input: {
		opacity: .9,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputActive: {

	},
	inputFocused: {
		opacity: 1
	},
	inputError: {
		borderBottomColor: styleVars.colors.red
	},
}