import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import layoutUtils from '../../components/utils/layout.utils';

interface MapPanelProps {
	style?: any,
	children: any,
	withTopBar: boolean
}

const MapPanel = (props: MapPanelProps) => {
	let heights = layoutUtils.getHeights()[ props.withTopBar ? 'withTopBar' : 'withoutTopBar' ];
	let panelStyles = [
		styles.container,
		props.style,
		{ minHeight: heights.minPanel }
	];
	
	return (
		<View style={ panelStyles }>
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
		minHeight: layoutUtils.getHeights().minPanel,
		transform: [{ translateY: - 10 }],
		borderWidth: 1,
		borderBottomWidth: 0,
		borderColor: '#E6EAF2',
	}
});
