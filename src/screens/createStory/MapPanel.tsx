import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import layoutUtils from '../../components/utils/layout.utils';

interface MapPanelProps {
	style?: any,
	children: any,
	withTopBar?: boolean,
	extraContent?: any
}

const MapPanel = (props: MapPanelProps) => {
	let heights = layoutUtils.getHeights()[ props.withTopBar ? 'withTopBar' : 'withoutTopBar' ];
	let panelStyles = [
		styles.container,
		props.style
	];

	let containerStyles = {
		minHeight: heights.minPanel
	}
	
	return (
		<View style={containerStyles}>
			<View style={panelStyles}>
				{props.children}
			</View>
			{props.extraContent}
		</View>
	);
};

export default MapPanel;

const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
		position: 'relative',
		zIndex: 5,
		backgroundColor: '#fff',
		borderRadius: 10,
		transform: [{ translateY: - 10 }],
		borderWidth: 1,
		borderColor: '#E6EAF2',
		paddingBottom: 20
	}
});
