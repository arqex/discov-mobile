import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, styleVars, TopBar } from '../../components';

export default class NoFollowing extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	render() {
		let header = (
			<View style={styles.noStoriesTitle}>
				<Image source={require('../_img/people.png')}
					style={styles.noStoriesImage} />
				<Text type="header">Following no one</Text>
			</View>
		);

		let topBar = (
			<TopBar title="Following"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		return (
			<Bg>
				<ScrollScreen
					animatedScrollValue={this.animatedScrollValue}
					header={header}
					topBar={topBar}>
					<View style={styles.noStoriesCard}>
						<Text>
{`The fun is in discovering stories around you, but you probably don't want find out about everybody.

Select the people you want to start discovering about and follow them.`}
						</Text>
						<View style={styles.button}>
							<Button onPress={ () => this.props.router.navigate('/myPeople/morePeople') }>
								Go find some people
							</Button>
						</View>
					</View>
				</ScrollScreen>
			</Bg>
		);
	}
}


const styles = StyleSheet.create({
	noStoriesTitle: {
		alignItems: 'center',
		marginBottom: 20
	},

	noStoriesImage: {
		width: 180,
		height: 116,
		marginBottom: 10
	},

	noStoriesCard: {
		...styleVars.card,
		padding: 20,
		marginBottom: 10
	},

	createWrapper: {
		marginTop: 20
	},

	button: {
		marginTop: 20
	},
});
