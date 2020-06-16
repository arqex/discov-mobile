import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, styleVars, SettingItem, TopBar } from '../../components';

export default class NoDiscoveries extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		let header = (
			<View style={ styles.noStoriesTitle }>
				<Image source={ require('../_img/no-discoveries.png') }
					style={ styles.noStoriesImage } />
				<Text type="header">No discoveries yet</Text>
			</View>
		);

		let topBar = (
			<TopBar title="My discoveries"
				onBack={ () => this.props.drawer.open() }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		return (
			<Bg>
				<ScrollScreen header={header}
					animatedScrollValue={this.animatedScrollValue}
					topBar={ topBar }>
						<View style={ styles.noStoriesCard }>
							<Text>Let's get started on discovering stories! Here's some tips to start unvealing what's around:</Text>
							<SettingItem title="Follow more people"
								subtitle="There are many people leaving stories around for you to discover"
								onPress={ () => this.props.router.navigate('/myPeople/morePeople') }
								border />
							<SettingItem title="Invite friends"
								subtitle="If you don't want to add the suggested people, invite some friends and tell them to share stories with you"
								border />
							<SettingItem title="Get out"
								subtitle="Your are not far away from some discoveries, you just need to get a bit closer!" />
						</View>
				</ScrollScreen>
			</Bg>
		);
  }
}


const styles = StyleSheet.create({
	noStoriesTitle: {
		alignItems: 'center'
	},

	noStoriesImage: {
		width: 136,
		height: 106,
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
