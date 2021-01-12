import * as React from 'react'
import { Text, View } from 'react-native'
import discoveryLoader from '../../state/loaders/discoveryLoader';
import storyLoader from '../../state/loaders/storyLoader';

export default class DiscoveryCard extends React.Component {
	render() {
		let discovery = discoveryLoader.getData( this, this.props.discoveryId );
		let story;
		if( discovery.data ){
			story = storyLoader.getData( this, discovery.data.storyId );
		}

		return (
			<View>
				<Text> textInComponent </Text>
			</View>
		)
	}
}