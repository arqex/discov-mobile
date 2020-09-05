import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../components';
import layoutUtils from '../../components/utils/layout.utils';

interface AssetViewerBarProps {
	onBack?: Function,
	withSafeArea?: boolean,
}

export default class AssetViewerBar extends React.Component<AssetViewerBarProps> {
	render() {
		let heights = layoutUtils.getHeights().withTopBar;
		let statusBarHeight = this.props.withSafeArea ? heights.statusBar : 0;

		let barStyles = [
			styles.bar,
			{ paddingTop: statusBarHeight, height: heights.topBar + statusBarHeight }
		];

		return (
			<View style={barStyles}>
				<Button type="icon"
					icon="arrow-back"
					iconColor="white"
					onPress={this.props.onBack} />
			</View>
		);
	}
};


const styles = StyleSheet.create({
	bar: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,.5)',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,.2)'
	},

});
