import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../components';
import layoutUtils from '../../components/utils/layout.utils';

interface AssetViewerDotProps {
	onBack?: Function,
	withSafeArea?: boolean,
}

export default class AssetViewerDot extends React.Component<AssetViewerDotProps> {
	render() {
		let dotStyles = [
			styles.dot,
			this.props.active && styles.dotActive
		];
		return (
			<View style={ styles.container }>
				<View style={ dotStyles }>

				</View>
			</View>
		);
	}
};


const styles = StyleSheet.create({
	container: {
		width: 14, 
		height: 14,
		borderWidth: 1,
		borderRadius: 7,
		borderColor: 'rgba(0,0,0,.5)',
		backgroundColor: 'rgba(0,0,0,.5)',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2
	},

	dot: {
		width: 12,
		height: 12,
		borderWidth: 2,
		borderRadius: 6,
		borderColor: 'rgba(255,255,255,.5)',
		transform: [{scale: .8}]
	},

	dotActive: {
		backgroundColor: 'rgba(rgba(255,255,255,.7)',
		borderColor: 'transparent',
		transform: [{scale: 1}]
	}

});
