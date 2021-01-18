import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, styleVars, SettingItem, TopBar } from '../../components';
import LocationService from '../../location/location.service';
import distoryListLoader from '../../state/loaders/distoryListLoader';

export default class NoDistories extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		let header = (
			<View style={styles.noStoriesTitle}>
				<Image source={require('../_img/no-discoveries.png')}
					style={styles.noStoriesImage} />
				<Text type="header">No stories yet</Text>
			</View>
		);

		let topBar = (
			<TopBar title="My stories"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		let movingTip = this.renderMovingTip();

		return (
			<Bg>
				<ScrollScreen header={header}
					animatedScrollValue={this.animatedScrollValue}
					onRefresh={this._onRefresh}
					topBar={topBar}>
					<View style={styles.noStoriesCard}>
						<View style={{marginBottom: 10}}>
							<Text>Here 3 tips to start discovering around:</Text>
						</View>
						<SettingItem title="Follow more people"
							subtitle="There are many people leaving stories around for you to discover"
							onPress={() => this.props.router.navigate('/myPeople/morePeople')}
							border />
						<SettingItem title="Create your own stories"
							subtitle="Your friends will be glad to discover the city is surrounding you. Create a story."
							onPress={() => this.props.router.navigate('/createStory') }
							border={ !!movingTip } />
						{ movingTip }
					</View>
				</ScrollScreen>
			</Bg>
		);
	}

	renderMovingTip() {
		let fence = LocationService.getFence();
		if( fence && fence.distanceToDiscovery !== -1 ){
			return (
				<SettingItem title="Start moving"
					subtitle="Your are not far away from some discoveries, you just need to get a bit closer!"
					onPress={ () => this.props.router.navigate('/settings/closestDiscovery') }
				/>
			);
		}
	}

	_onRefresh() {
		return distoryListLoader.loadData('none');
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
