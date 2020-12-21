import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { Bg, ScrollScreen, Text, TopBar } from '../../components'
import { ScreenProps } from '../../utils/ScreenProps';

export default class ActivityEventsScreen extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	render() {
		return (
			<Bg>
				<ScrollScreen
					animatedScrollValue={this.animatedScrollValue}
					topBar={this.renderTopBar()}
					header={this.renderHeader()}>
					<View>
						<Text> textInComponent </Text>
					</View>
					</ScrollScreen>
			</Bg>
		)
	}

	renderHeader() {
		return <Text type="header">Activity</Text>;
	}

	renderTopBar() {
		return (
			<TopBar title="Activity"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}
}