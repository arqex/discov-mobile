import * as React from 'react';
import { View, StyleSheet, StatusBar, Animated } from 'react-native';
import storeService from '../../state/store.service';
import Gallery from '../../react-native-image-gallery/src/Gallery';
import AssetViewerDots from './AssetViewerDots';
import AssetStoryHeader from './AssetStoryHeader';
import { DarkTopBar } from '../../components';

interface AssetsViewerProps {
	router: any,
	location: any
}

export default class AssetsViewer extends React.Component<AssetsViewerProps> {
	state = {
		page: 0
	}

	isMetaDisplayed = true

	animatedValue = new Animated.Value(1);
	barTranslate = this.animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange:[ -100, 0]
	})

	dotsTranslate = this.animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [80, 0]
	})

	render() {
		let images = this.getImages();

		let barStyles = [
			styles.topBar,
			{transform: [{translateY: this.barTranslate}]}
		];
		let dotsStyles = [
			styles.dots,
			{ transform: [{ translateY: this.dotsTranslate }] }
		];

		return (
			<View style={ styles.container }>
				<Animated.View style={ barStyles}>
					<DarkTopBar
						onBack={ () => this.props.router.back()}
						content={ this.renderStoryHeader() }
						withSafeArea />
				</Animated.View>
				<Gallery images={ images }
					style={{flex: 1}}
					onPageSelected={ page => this.setState({page}) }
					onViewTransformed={ this._onImageTransform } />
				<Animated.View style={ dotsStyles }>
					<AssetViewerDots
						size={ images.length }
						active={ this.state.page }/>
				</Animated.View>
			</View>
		);
	}

	renderStoryHeader() {
		let story = this.getStory();

		console.log( story.ownerId )

		return (
			<AssetStoryHeader 
				accountId={ story.ownerId }
				story={story} />
		);
	}

	componentWillEnter() {
		StatusBar.setBarStyle('light-content');
	}

	componentWillLeave() {
		StatusBar.setBarStyle('dark-content');
	}

	getStory() {
		let storyId = this.props.location.params.id;
		return storeService.getStory(storyId);
	}

	getImages() {
		return this.getStory().content.assets.map( asset => ({source: {uri: asset.data}}) );
	}

	_onImageTransform = transform => {
		console.log( transform );
		if( this.isMetaDisplayed && transform.scale > 1 ){
			this.hideMeta();
		}
		else if( !this.isMetaDisplayed && transform.scale === 1 ){
			this.showMeta();
		}
	}

	showMeta() {
		Animated.timing( this.animatedValue, {
			toValue: 1,
			duration: 300
		}).start();
		this.isMetaDisplayed = true
	}

	hideMeta() {
		Animated.timing(this.animatedValue, {
			toValue: 0,
			duration: 300
		}).start();
		this.isMetaDisplayed = false
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	topBar: {
		position: 'absolute',
		top: 0, left: 0, right: 0,
		zIndex: 10
	},
	dots: {
		position: 'absolute',
		bottom: 50, left: 0, right: 0,
		zIndex: 10,
		alignItems: 'center'
	}
});
