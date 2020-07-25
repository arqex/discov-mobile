import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { storyService } from '../../services/story.service';
import storeService from '../../state/store.service';
import StoryScreen from '../components/StoryScreen';

export default class OwnStory extends Component<ScreenProps> {

	state = {
		region: {
			latitude: 34,
			longitude: 4,
			latitudeDelta: 1,
			longitudeDelta: 1
		}
	};

	render() {
		let story = storeService.getStory(this.getId());

		if (!story) {
			return this.renderLoading();
		}

		const currentPosition = storeService.getCurrentPosition();

		return (
			<StoryScreen
				story={story}
				layout={this.props.layout}
				router={ this.props.router }
				currentPosition={ currentPosition && currentPosition.coords }
				onBack={this._goBack} />
		);
	}

	renderLoading() {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	_goBack = () => {
		this.props.router.navigate('/myDiscoveries');
	}

	getId() {
		return this.props.location.params.id;
	}

	componentDidMount() {
		let story = storeService.getStory(this.getId());
		if (!story) {
			storyService.loadStory(this.getId())
				.then(() => {
					this.forceUpdate()
				})
			;
		}
	}
}