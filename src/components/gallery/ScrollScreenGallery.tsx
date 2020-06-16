import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ScrollScreen from '../ScrollScreen';
import Text from '../Text';

interface ScrollScreenProps { }

export default class ScrollScreenGallery extends React.Component<ScrollScreenProps> {
	render() {

		const header = (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Text type="header">Open header</Text>
			</View>
		);

		const topBar = (
			<View style={{backgroundColor: 'blue'}}>
				<Text>Open top controls</Text>
			</View>
		);

		const preListBar = (
			<View style={{backgroundColor: 'pink'}}>
				<Text>Open bottom controls</Text>
			</View>
		);

		return (
			<ScrollScreen
				topBar={ topBar }
				header={ header }
				preListBar={ preListBar }>
				<View style={ styles.container }>
					<View style={{height: 50}}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
				</View>
			</ScrollScreen>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0f0'
	}
});
