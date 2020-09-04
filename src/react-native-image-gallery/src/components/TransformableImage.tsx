import * as React from 'react';
import { View, Text, Image, ImageLoadEventData, ImageStyle, ImageResizeMode } from 'react-native';
import ViewTransformer, { TransformEvent } from './ViewTransformer';

export interface TransformableImageData {
	source: number | { uri: string },
	dimensions?: { width: number, height: number }
}

interface TransformableImageProps {
	image: TransformableImageData,
	style?: ImageStyle,
	onLoad?: (event: ImageLoadEventData) => any,
	onLoadStart?: () => any,
	enableTransform?: boolean,
	enableScale?: boolean,
	enableTranslate?: boolean,
	onViewTransformed?: (event: TransformEvent) => any,
	onTransformGestureReleased?: (event: TransformEvent) => any,
	errorComponent?: React.ComponentType | React.FunctionComponent,
	imageComponent?: React.ComponentType | React.FunctionComponent,
	resizeMode?: ImageResizeMode
}

export default class TransformableImage extends React.PureComponent<TransformableImageProps> {
	static defaultProps = {
		enableTransform: true,
		enableScale: true,
		enableTranslate: true,
		imageComponent: undefined,
		resizeMode: 'contain'
	};

	_mounted = true;

	state = {
		viewWidth: 0,
		viewHeight: 0,
		imageLoaded: false,
		imageDimensions: this.props.image.dimensions,
		keyAccumulator: 1,
		error: false
	};

	viewTransformer = React.createRef<ViewTransformer>()

	constructor(props) {
		super(props);

		let image = this.props.image;
		if (!image.dimensions) {
			this.getImageSize(image);
		}
	}

	componentDidUpdate(prevProps) {
		if (!sameImage(this.props.image, prevProps.image)) {
			// image source changed, clear last image's imageDimensions info if any
			this.setState({
				imageDimensions: this.props.image.dimensions,
				keyAccumulator: this.state.keyAccumulator + 1
			});
			if (!this.props.image.dimensions) { // if we don't have image dimensions provided in source
				this.getImageSize(this.props.image);
			}
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_onLoadStart = () => {
		this.props.onLoadStart && this.props.onLoadStart();
		if (this.state.imageLoaded) {
			this.setState({ imageLoaded: false });
		}
	}

	_onLoad = e => {
		this.props.onLoad && this.props.onLoad(e);
		if (!this.state.imageLoaded) {
			this.setState({ imageLoaded: true });
		}
	}

	_onLayout = e => {
		let { width, height } = e.nativeEvent.layout;
		if (this.state.viewWidth !== width || this.state.viewHeight !== height) {
			this.setState({ viewWidth: width, viewHeight: height });
		}
	}

	getImageSize(image) {
		if (!image) {
			return;
		}
		const { source, dimensions } = image;

		if (dimensions) {
			this.setState({ imageDimensions: dimensions });
			return;
		}

		if (source && source.uri) {
			Image.getSize(
				source.uri,
				(width, height) => {
					if (width && height) {
						if (this.state.imageDimensions && this.state.imageDimensions.width === width && this.state.imageDimensions.height === height) {
							// no need to update state
						} else {
							this._mounted && this.setState({ imageDimensions: { width, height } });
						}
					}
				},
				() => {
					this._mounted && this.setState({ error: true });
				}
			);
		} else {
			console.warn('react-native-image-gallery', 'Please provide dimensions of your local images');
		}
	}

	// This is accessed by the main gallery component
	getViewTransformerInstance() {
		return this.viewTransformer.current;
	}

	render() {
		const { imageDimensions, viewWidth, viewHeight, keyAccumulator, imageLoaded, error } = this.state;
		const { style, image, imageComponent, resizeMode, enableTransform, enableScale, enableTranslate, onTransformGestureReleased, onViewTransformed } = this.props;

		let maxScale = 1;
		let contentAspectRatio;
		let width, height; // imageDimensions

		if (imageDimensions) {
			width = imageDimensions.width;
			height = imageDimensions.height;
		}

		if (width && height) {
			contentAspectRatio = width / height;
			if (viewWidth && viewHeight) {
				maxScale = Math.max(width / viewWidth, height / viewHeight);
				maxScale = Math.max(1, maxScale);
			}
		}

		return (
			<ViewTransformer
				ref={this.viewTransformer}
				key={'viewTransformer#' + keyAccumulator} // when image source changes, we should use a different node to avoid reusing previous transform state
				enableTransform={enableTransform && imageLoaded} // disable transform until image is loaded
				enableScale={enableScale}
				enableTranslate={enableTranslate}
				enableResistance={true}
				onTransformGestureReleased={onTransformGestureReleased}
				onViewTransformed={onViewTransformed}
				maxScale={maxScale}
				contentAspectRatio={contentAspectRatio}
				onLayout={this._onLayout}
				style={style}>
				{error ? this.renderError() : this.renderImage()}
			</ViewTransformer>
		);
	}

	renderImage() {
		const { imageLoaded, imageDimensions = {} } = this.state;
		const { style, image, resizeMode, enableTransform, enableScale, enableTranslate, onTransformGestureReleased, onViewTransformed } = this.props;

		const imageProps = {
			...this.props,
			imageLoaded,
			source: image.source,
			style: [style, { backgroundColor: 'transparent'}],
			resizeMode: resizeMode,
			onLoadStart: this._onLoadStart,
			onLoad: this._onLoad,
			capInsets: { left: 0.1, top: 0.1, right: 0.1, bottom: 0.1 }
		};

		let ImageComponent = this.props.imageComponent;
		if (ImageComponent) {
			return <ImageComponent {...imageProps} />;
		}
		else {
			return <Image {...imageProps} />
		}
	}

	renderError() {
		let ErrorComponent = this.props.errorComponent;
		if (ErrorComponent) {
			return <ErrorComponent />;
		}

		return (
			<View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
			</View>
		);
	}
}

function sameImage(source, nextSource) {
	if (source === nextSource) {
		return true;
	}
	if (source && nextSource) {
		if (source.uri && nextSource.uri) {
			return source.uri === nextSource.uri;
		}
	}
	return false;
}
