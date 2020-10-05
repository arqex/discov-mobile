import * as React from 'react';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { DarkTopBar } from '../../components';
import AvatarTransition from './AvatarTransition';
import Gallery from '../../react-native-image-gallery/src/Gallery';

interface PeerAccountImageViewerProps {
	animatedValue: Animated.Value,
	onBack: () => any,
	imageUri: string,
	initialBox?: { x: number, y: number, width: number, height: number },
}

class PeerAccountImageViewer extends React.Component<PeerAccountImageViewerProps> {

	backgroundOpacity = this.props.animatedValue.interpolate({
		inputRange: [0, .8, 1],
		outputRange: [0, 1, 1]
	});

	placeholderOpacity = this.props.animatedValue.interpolate({
		inputRange: [0, .05, .1],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp'
	});

	galleryOpacity = this.props.animatedValue.interpolate({
		inputRange: [0, .85, 1 ],
		outputRange: [ 0, 0, 1 ]
	});

	barTranslate = new Animated.Value(0)

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.props.animatedValue.addListener( ({value}) => {
			if( value === 1 && !this.state.open ){
				this.setState({open: true});
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				{ this.renderPlaceholder() }
				{ this.renderBackground() }
				{ this.renderGallery() }
				{ this.renderAvatarTransition() }
			</View>
		);
	}

	_onBack = () => {
		if ( this.state.open ){
			this.setState({ open: false }, () => {
				this.props.onBack();
			});
		}
		else {
			this.props.onBack();
		}
	}

	renderPlaceholder() {
		const initialBox = this.props.initialBox;
		if( !this.props.initialBox ) return;

		let wrapperStyle = [
			styles.placeholderWrapper,
			{ opacity: this.placeholderOpacity }
		]

		let phStyle = {
			width: initialBox.width,
			height: initialBox.height,
			top: initialBox.y,
			left: initialBox.x,
			backgroundColor: 'white',
			borderRadius: initialBox.width / 2,
			overflow: 'hidden'
		}

		return (
			<Animated.View style={ wrapperStyle }>
				<View style={ phStyle } />
			</Animated.View>
		);
	}

	renderBackground() {
		let st = [
			styles.background,
			{ opacity: this.backgroundOpacity }
		];

		return <Animated.View style={ st } />;
	}

	renderAvatarTransition() {
		if( !this.props.initialBox ) return;

		let st = {
			position: 'absolute',
			top: 0, left: 0, right: 0, bottom: 0,
			zIndex: this.state.open ? 3 : 3
		};

		return (
			<View style={st}>
				<AvatarTransition
					imageUri={this.props.imageUri}
					animatedValue={this.props.animatedValue}
					initialBox={this.props.initialBox}
				/>
			</View>
		)
	}

	renderGallery() {
		let galleryStyles = {
			opacity: this.galleryOpacity,
			position: 'absolute',
			top: 0, left: 0, right: 0, bottom: 0,
			zIndex: this.state.open ? 10 : 0
		};

		let barStyles = [
			styles.topBar,
			{ transform: [{ translateY: this.barTranslate }] }
		];

		return (
			<Animated.View style={ galleryStyles }>
				<Animated.View style={barStyles}>
					<DarkTopBar onBack={this._onBack} withSafeArea />
				</Animated.View>
				{ this.renderSpinner() }
				<Gallery
					images={[{ source: { uri: this.props.imageUri } }]}
					style={{ flex: 1, backgroundColor: 'black', zIndex: 10 }}
					onViewTransformed={this._onImageTransform} />
			</Animated.View>
		);
	}

	renderSpinner() {
		let styles = {
			position: 'absolute',
			top: 0, left: 0, right: 0, bottom: 0,
			justifyContent: 'center', alignItems: 'center',
			zIndex: 1
		};

		return (
			<View style={ styles }>
				<ActivityIndicator color="white" />
			</View>
		)
	}

	_onImageTransform = transform => {
		if (this.isBarDisplayed && transform.scale > 1.1) {
			this.hideBar();
		}
		else if (!this.isBarDisplayed && transform.scale <= 1.1) {
			this.showBar();
		}
	}

	showBar() {
		Animated.timing(this.barTranslate, {
			toValue: 0,
			duration: 300
		}).start();
		this.isBarDisplayed = true
	}

	hideBar() {
		Animated.timing(this.barTranslate, {
			toValue: -100,
			duration: 300
		}).start();
		this.isBarDisplayed = false
	}
};

export default PeerAccountImageViewer;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	background: {
		backgroundColor: 'black',
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
		zIndex: 2
	},
	topBar: {
		position: 'absolute',
		top: 0, left: 0, right: 0,
		zIndex: 20
	},
	placeholderWrapper: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
		zIndex: 1
	}
});
