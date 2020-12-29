import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import storeService from '../../state/store.service';
import StoryScreen from '../components/StoryScreen';
import locationService from '../../location/location.service';

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

		return (
			<StoryScreen
				story={ storeService.getStory( discovery.storyId ) }
				layout={this.props.layout}
				router={this.props.router}
				location={this.props.location}
				currentPosition={ locationService.getLastLocation() }
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
		this.props.router.back();
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