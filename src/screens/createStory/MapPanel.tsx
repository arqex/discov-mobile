import * as React from 'react';
import { View, StyleSheet } from 'react-native';

interface MapPanelProps {
	style?: any,
	children: any
}

const MapPanel = (props: MapPanelProps) => {
	let propStyles = props.style || {};
	return (
		<View style={[styles.container, propStyles]}>
			{ props.children }
		</View>
	);
};

export default MapPanel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		position: 'relative',
		zIndex: 5,
		backgroundColor: '#fff',
		borderRadius: 10,
		minHeight: 600,
		transform: [{ translateY: - 10 }],
		borderWidth: 1,
		borderColor: '#E6EAF2',
	}
});
