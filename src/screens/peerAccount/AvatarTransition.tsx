import * as React from 'react';
import { View, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import layoutUtils from '../../components/utils/layout.utils';

interface AvatarTransitionProps {
	imageUri: string,
	initialBox?: {x: number, y: number, width: number, height: number},
	animatedValue: Animated.Value
}

let windowSize = Dimensions.get('window');

class AvatarTransition extends React.PureComponent<AvatarTransitionProps> {
	constructor( props ) {
		super(props);

		this.state = this.getResetState();
		this.mounted = true;
		
		console.log('constructed!!');
	}

	animatedOpacity = this.props.animatedValue.interpolate({
		inputRange: [ 0, .1, .99, 1],
		outputRange:[ 0, 1, 1, 0]
	});

	getResetState(){
		return {
			imageSize: { width: 0, height: 0 },
			finalBox: { width: 0, height: 0, x: 0, y: 0 },
			initialScale: 0.01,
			finalScale: 0.01,
			loadedUri: false
		};
	}

	render() {
		if( !this.animatedScale ) return null;

		console.log( this.state.imageSize, this.state.initialScale );

		let placeholderStyles = [
			styles.placeholder,
			this.state.imageSize,
			{opacity: this.animatedOpacity, borderRadius: this.animatedRadius},
			{ transform: [
				{ translateY: this.animatedTranslate },
				{ scale: this.animatedScale }
			]}
		];

		return (
			<View style={styles.container}>
				<Animated.View style={placeholderStyles}>
					<Image resizeMode="cover"
						source={{uri: this.props.imageUri}}
						style={{flex:1}} />
				</Animated.View>
			</View>
		);
	}

	fetchImageSize() {
		this.animatedScale = false;
		this.setState( this.getResetState() );

		let uri = this.props.imageUri;

		let onSuccess = (width, height) => {
			if( uri !== this.props.imageUri ) return;
			if( uri === this.state.loadedUri ) return;
			
			this.calculateTransforms( width, height);
			console.log( 'setting image size');
			this.setState({
				loadedUri: uri,
				imageSize: { width, height }
			});

			this.forceUpdate();
		};

		let onError = error => {
			if (uri !== this.props.imageUri) return;
			if (uri === this.state.loadedUri) return;

			console.warn( error );
			this.mounted && this.setState({ error: true });
		};

		Image.getSize( this.props.imageUri, onSuccess, onError );
	}

	componentDidMount(){
		this.fetchImageSize();
	}

	componentDidUpdate( prevProps ){
		if( prevProps.imageUri !== this.props.imageUri ){
			this.fetchImageSize();
		}
	}

	calculateTransforms( width, height ){
		let aspectRatio = width / height;
		let initialBox = this.props.initialBox;

		let initialScale = aspectRatio > 1 ?
			initialBox.height / height :
			initialBox.width / width
		;

		let finalScale = windowSize.width / width < windowSize.height / height ?
			windowSize.width / width :
			windowSize.height / height
		;

		this.animatedScale = this.props.animatedValue.interpolate({
			inputRange: [0, .3, .8, 1],
			outputRange: [initialScale, initialScale, finalScale, finalScale]
		})

		let initialCenter = initialBox.y + (initialBox.height / 2);
		let windowCenter = windowSize.height / 2;
		let translate = initialCenter - windowCenter;

		this.animatedTranslate = this.props.animatedValue.interpolate({
			inputRange: [0, .1, .8, 1],
			outputRange:[ translate, translate, 0, 0]
		});

		let maxradius = aspectRatio > 1 ? height / 2 : width / 2;
		this.animatedRadius = this.props.animatedValue.interpolate({
			inputRange: [0, .1, .9, 1],
			outputRange: [maxradius, maxradius, 0, 0]
		});

		this.setState({initialScale, finalScale });

		console.log( initialScale, finalScale );
	}
};

export default AvatarTransition;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	placeholder: {
		overflow: 'hidden'
	}
});
