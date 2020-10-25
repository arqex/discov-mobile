import * as React from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { Bg, ScrollScreen, TopBar } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';

export default class StoryComments extends React.Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		return (
			<Bg>
				<ScrollScreen
					header={this.renderHeader()}
					topBar={this.renderTopBar()}
				/>
			</Bg>
		);
	}

	renderHeader() {

	}

	renderTopBar() {
		return (
			<TopBar title="My stories"
				onBack={ this._goBack }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}

	_goBack = () => {
		this.props.router.back();
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
