import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ListItem, {ListItemProps} from './ListItem';
import styleVars from './styleVars';

interface SettingItemProps extends ListItemProps{
	border?: boolean
}

const SettingItem = (props: SettingItemProps) => {
	const { border, ...others } = props;
	let itemStyles = [
		styles.container,
		props.border && styles.border
	];
	
	return (
		<ListItem {...others}
			style={ itemStyles }
			titleColor={ styleVars.colors.text } />
	);
};

export default SettingItem;

const styles = StyleSheet.create({
	container: {
		paddingTop: 12,
		paddingBottom: 12
	},
	border: {
		borderBottomColor: styleVars.colors.borderBlue,
		borderBottomWidth: 1
	}
});
