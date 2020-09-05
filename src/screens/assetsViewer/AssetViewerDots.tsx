import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import AssetViewerDot from './AssetViewerDot';

interface AssetViewerDotsProps {
	onBack?: Function,
	withSafeArea?: boolean,
}

export default class AssetViewerDots extends React.Component<AssetViewerDotsProps> {
	render() {

		let dots = [];

		for( let i = 0; i < this.props.size; i++ ){
			dots.push(
				<AssetViewerDot
					active={ i === this.props.active }
					key={`dot${i}`} />
			);
		}


		return (
			<View style={ styles.container }>
				{ dots }
			</View>
		);
	}
};


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});
