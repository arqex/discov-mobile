import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import StoryScreen from '../components/StoryScreen';
import locationService from '../../location/location.service';
import storyLoader from '../../state/loaders/storyLoader';
import discoveryLoader from '../../state/loaders/discoveryLoader';

export default class SingleDistoryScreen extends Component<ScreenProps> {
	state = {
		region: {
			latitude: 34,
			longitude: 4,
			latitudeDelta: 1,
			longitudeDelta: 1
		}
	};

	render() {
		let story = this.getStory();

		if (story.isLoading) {
			return this.renderLoading();
		}

		return (
			<StoryScreen
				story={story.data}
				layout={this.props.layout}
				router={this.props.router}
				location={this.props.location}
				avatarNavigable={ !isStoryId( this.getId()) }
				currentPosition={locationService.getLastLocation()}
				onBack={this._goBack} />
		);
	}
	
	getStory(): DataLoaderResult<Story> {
		let id = this.getId();
		if( isStoryId( id ) ){
			return storyLoader.getData( this, id );
		}

		let discovery = discoveryLoader.getData( this, id );
		if( discovery.data ){
			return storyLoader.getData( this, discovery.data.storyId );
		}

		return {error: false, isLoading: true}
	}

	renderLoading() {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	_goBack = () => {
		this.props.router.back()
	}

	getId() {
		return this.props.location.params.id;
	}
}

function isStoryId( id: string ){
	return id.endsWith('st');
}