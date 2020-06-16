import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapScreen, Button, StoryHeader, Text } from '../../components';
import MapPanel from '../createStory/MapPanel';
import StoryMap from './StoryMap';
import { lngToLocation } from '../../utils/maps';

interface StoryScreenProps {
	story: any,
	layout: any,
	onBack?: Function,
	currentPosition?: any
}

export default class StoryScreen extends Component<StoryScreenProps> {
	render() {
		let story = this.props.story;

		if (!story) {
			return this.renderLoading();
		}

		return (
			<MapScreen
				map={this.renderMap(story)}
				mapTop={this.renderMapBar()}
				layout={this.props.layout}>
				<MapPanel style={styles.panel}>
					{this.renderContent(story)}
				</MapPanel>
			</MapScreen>
		)
	}

	renderMap(story) {
		let storyLocation = {
			location: story
		};

		return (
			<StoryMap storyLocation={ storyLocation }
				mapPadding={{ top: 20, right: 0, bottom: -20, left: 0 }}
				showMarker
				currentPosition={ this.props.currentPosition } />
		);
	}

	renderContent(story) {
		return (
			<View style={ styles.header }>
				<StoryHeader accountId={story.ownerId}
					story={story} />
					<Text type="paragraph">
					{story.content.text}
				</Text>
			</View>
		)
	}

	renderLoading() {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	renderMapBar() {
		if( !this.props.onBack ) return;

		return (
			<View style={styles.mapBar}>
				<Button type="iconFilled"
					icon="arrow-back"
					color="white"
					onPress={ this.props.onBack }
					withShadow />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	panel: {
		paddingTop: 0,
		paddingRight: 30
	},
	mapBar: {
		marginLeft: 20,
		marginRight: 20
	},
	header: {
		paddingLeft: 20,
		paddingRight: 20
	}
});