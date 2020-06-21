import { StyleSheet } from 'react-native';
import { styleVars } from '../../components';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';

export default StyleSheet.create({
	container: {
		paddingTop: getNavigationBarHeight(),
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	header: {
		alignItems: 'center',
		marginBottom: 30
	},
	title: {
		marginBottom: 0
	},
	body: {
		marginBottom: 30,
		alignSelf: 'stretch'
	},
	card: {
		backgroundColor: '#fff',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
		paddingBottom: 20,
		borderRadius: 10,
		marginBottom: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 2,
		borderBottomWidth: 2,
		borderWidth: 1,
		borderColor: styleVars.colors.borderRed
	},
	content: {
		maxWidth: 360,
		minWidth: 1,
		flex: 1,
		overflow: 'hidden',
		alignItems: 'stretch'
	}
});