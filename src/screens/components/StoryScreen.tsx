import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapScreen, Button, StoryHeader, Text, Wrapper, Bg } from '../../components';
import MapPanel from '../createStory/MapPanel';
import StoryCommentsButton from './StoryCommentsButton';
import StoryMap from './StoryMap';

interface StoryScreenProps {
	story: any,
	layout: any,
	router: any,
	location: any,
	avatarNavigable: boolean,
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
			<Bg>
				<MapScreen
					map={this.renderMap(story)}
					mapTop={this.renderMapBar()}
					layout={this.props.layout}>
					<MapPanel style={styles.panel}>
						{this.renderContent(story)}
					</MapPanel>
				</MapScreen>
			</Bg>
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
				<StoryHeader
					storyId={ story.id }
					router={ this.props.router }
					accountNavigable={ this.props.avatarNavigable }
					onAssetsPress={ this._navigateToImages } />
				<Wrapper textWidth>
					<Text type="paragraph">
						{story.content.text}
					</Text>
				</Wrapper>
				{ this.renderControls() }
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

	renderControls() {
		return (
			<View style={ styles.controls }>
				<View style={styles.leftControls} />
				<View style={styles.rightControls}>
					<StoryCommentsButton
						story={this.props.story}
						onPress={this._navigateToComments} />
				</View>
			</View>
		)
	}

	_navigateToImages = () => {
		this.props.router.navigate(`${this.getStoryPath()}/assets`);
	}

	_navigateToComments = () => {
		this.props.router.navigate(`${this.getStoryPath()}/comments`);
	}

	getStoryPath = () => {
		let { location } = this.props;
		return `${location.matchIds[0]}/${location.params.id}`;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	panel: {
		paddingTop: 0
	},
	mapBar: {
		marginLeft: 20,
		marginRight: 20
	},
	header: {
		paddingLeft: 20,
		paddingRight: 20
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 20,
		maxWidth: 380,
		width: '100%'
	},
	leftControls: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	rightControls: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});