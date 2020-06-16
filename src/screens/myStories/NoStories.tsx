import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, TopBar, styleVars } from '../../components';

export default class NoStories extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
    let header = (
			<View style={ styles.noStoriesTitle }>
				<Image source={ require('../_img/no-stories.png') }
					style={ styles.noStoriesImage } />
				<Text type="header">Write your own story!</Text>
			</View>
		);
		
		const topBar = (
			<TopBar
				onBack={() => this.props.drawer.open()}
				withSafeArea
				animatedScrollValue={this.animatedScrollValue}
				title="My stories" />
		);

		return (
			<Bg>
				<ScrollScreen header={header}
					animatedScrollValue={this.animatedScrollValue}
					topBar={ topBar }>
						<View style={ styles.noStoriesCard }>
							<Text>You haven't placed any story yet. Surprise your followers with the first one!</Text>
							<View style={ styles.createWrapper }>
								<Button onPress={ this._createStory }>
									Create story
								</Button>
							</View>
						</View>
				</ScrollScreen>
			</Bg>
		);
	}
	
	_createStory = () => {
		this.props.router.navigate('/createStory')
	}
}


const styles = StyleSheet.create({
	noStoriesTitle: {
		alignItems: 'center'
	},

	noStoriesImage: {
		width: 150,
    height: 93,
    marginTop: 20,
		marginBottom: 10
	},

	noStoriesCard: {
		...styleVars.card,
		padding: 20,
		marginBottom: 10
	},

	createWrapper: {
		marginTop: 20
	}
});
