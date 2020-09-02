import * as React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { TopBar } from '../../components';
import storeService from '../../state/store.service';
import Gallery from 'react-native-image-gallery';

interface AssetsViewerProps {
	router: any,
	location: any
}

export default class AssetsViewer extends React.Component<AssetsViewerProps> {
	render() {
		let images = this.getImages();

		console.log( images );

		return (
			<View style={ styles.container }>
				<TopBar onBack={ () => this.props.router.back() } withSafeArea />
				<Gallery images={ images }
					style={{flex: 1}} />
			</View>
		);
	}

	componentWillEnter() {
		StatusBar.setBarStyle('light-content');
	}

	componentWillLeave() {
		StatusBar.setBarStyle('dark-content');
	}

	getImages() {
		let storyId = this.props.location.params.id;
		let story = storeService.getStory( storyId );

		return story.content.assets.map( asset => ({source: {uri: asset.data}}) );
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	}
});
