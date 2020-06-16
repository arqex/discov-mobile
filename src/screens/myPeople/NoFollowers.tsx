import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated} from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, styleVars, TopBar } from '../../components';

export default class NoFollowers extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		let header = (
			<View style={styles.noStoriesTitle}>
				<Image source={require('../_img/people.png')}
					style={styles.noStoriesImage} />
				<Text type="header">No followers yet</Text>
			</View>
		);

		const topBar = (
			<TopBar
				onBack={ () => this.props.drawer.open() }
				withSafeArea
				animatedScrollValue={this.animatedScrollValue}
				title="My followers" />
		);

		return (
			<Bg>
				<ScrollScreen header={header}
					animatedScrollValue={ this.animatedScrollValue }
					topBar={topBar}>
					<View style={styles.noStoriesCard}>
						<Text>
							Getting some followers is not as hard as it may seem. Here some tips:
						</Text>
						<View style={styles.tip}>
							<Text type="title">
								Tell your friends that your are on discov
							</Text>
							<Text>
								{`Use the button to send your friends a link to your profile, so they can start following you quickly.
							
If they don't use Discov yet, the link will ask them to join, and they will be following you automatically after register.`}
							</Text>
						</View>
						<View style={styles.tip}>
							<Text type="title">
								Create stories for all your followers
							</Text>
							<Text>
								Even if you don't have followers yet, you can start creating stories and share them with all your followers.
								People who share stories with "All followers" are easier to find in the "More people" section.
							</Text>
						</View>
						<View style={styles.button}>
							<Button onPress={() => this.props.router.navigate('/myPeople/morePeople')}>
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

	tip: {
		marginTop: 10,
		marginBottom: 10
	}
});
