import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import styleVars from './styleVars';

interface PanelProps {
	style?: any,
	borderColor?: 'blue' | 'red',
	children?: any,
}

const Panel = (props: PanelProps) => {
	return (
		<View style={[styles.container, styles[`border_${props.borderColor}`], props.style]}>
			{ props.children }
		</View>
	);
};

export default Panel;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E6EAF2',
	},
	border_red: {
		borderColor: '#fdeeee'
	}
});
