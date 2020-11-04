import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import storeService from '../../state/store.service';
import StoryScreen from '../components/StoryScreen';

export default class OwnDiscovery extends Component<ScreenProps> {
	state = {
		region: {
			latitude: 34,
			longitude: 4,
			latitudeDelta: 1,
			longitudeDelta: 1
		}
	};
	render() {
		const discovery = this.getDiscovery();

		if (!discovery) {
			return this.renderLoading();
		}

		const currentPosition = storeService.getCurrentPosition();
		const story = storeService.getStory( discovery.storyId );

		return (
			<StoryScreen
				story={story}
				layout={this.props.layout}
				router={this.props.router}
				location={this.props.location}
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
		if (!this.getDiscovery() ) {
			this.props.actions.discovery.load( this.getId() );
		}
	}

	getDiscovery() {
		return storeService.getDiscovery( this.getId() );
	}
}