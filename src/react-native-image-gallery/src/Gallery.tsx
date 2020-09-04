import * as React from 'react';
import { ViewProps, ViewStyle, PanResponderGestureState, FlatListProps, GestureResponderEvent } from 'react-native';
import { createResponder } from './libraries/GestureResponder';
import TransformableImage, {TransformableImageData} from './components/TransformableImage';
import ViewPager, { PagerScrollEvent } from './components/ViewPager';

const DEFAULT_FLAT_LIST_PROPS = {
	windowSize: 3
};

interface GalleryResponder {
	onStart: (event: GestureResponderEvent, state: PanResponderGestureState) => any,
	onMove: (event: GestureResponderEvent, state: PanResponderGestureState) => any,
	onEnd: (event: GestureResponderEvent, state: PanResponderGestureState, disableSettle?: boolean) => any,
}

interface GalleryProps extends ViewProps {
	images: [TransformableImageData],
	initialPage?: number,
	scrollViewStyle?: ViewStyle,
	pageMargin?: number,
	onPageSelected?: (pageIndex: number) => any,
	onPageScrollStateChanged?: (state: string) => any,
	onPageScroll?: (event: PagerScrollEvent) => any,
	onSingleTapConfirmed?: (pageIndex: number) => any,
	onGalleryStateChanged?: (dontknow: boolean) => any,
	onLongPress?: (gestureState: PanResponderGestureState) => any,
	removeClippedSubview?: boolean,
	imageComponent?: JSX.Element,
	errorComponent?: JSX.Element,
	flatListProps?: FlatListProps<any>
}


export default class Gallery extends React.PureComponent<GalleryProps> {
	static defaultProps = {
		removeClippedSubviews: true,
		imageComponent: undefined,
		scrollViewStyle: {},
		flatListProps: DEFAULT_FLAT_LIST_PROPS
	};

	imageRefs = new Map();
	activeResponder = undefined;
	firstMove = true;
	currentPage = 0;
	pageCount = 0;
	gestureResponder = undefined;
	_isMounted = true;
	_longPressTimeout = -1;

	viewPagerResponder: GalleryResponder;
	imageResponder: GalleryResponder;

	viewPager = React.createRef<ViewPager>();

	constructor(props) {
		super(props);
		this.createResponder();
	}

	createResponder() {
		let onResponderReleaseOrTerminate = (evt, gestureState) => {
			if (this.activeResponder) {
				if (this.activeResponder === this.viewPagerResponder &&
					!this.shouldScrollViewPager(evt, gestureState) &&
					Math.abs(gestureState.vx) > 0.5) {
					this.activeResponder.onEnd(evt, gestureState, true);
					this.getViewPager().flingToPage(this.currentPage, gestureState.vx);
				} else {
					this.activeResponder.onEnd(evt, gestureState);
				}
				this.activeResponder = null;
			}
			this.firstMove = true;
			this.props.onGalleryStateChanged && this.props.onGalleryStateChanged(true);
		};

		this.gestureResponder = createResponder({
			onStartShouldSetResponderCapture: (evt, gestureState) => true,
			onStartShouldSetResponder: (evt, gestureState) => true,
			onResponderGrant: this._activeImageResponder,
			onResponderMove: (evt, gestureState) => {
				if (this.firstMove) {
					this.firstMove = false;
					if (this.shouldScrollViewPager(evt, gestureState)) {
						this.activeViewPagerResponder(evt, gestureState);
					}
					this.props.onGalleryStateChanged && this.props.onGalleryStateChanged(false);
				}
				if (this.activeResponder === this.viewPagerResponder) {
					const dx = gestureState.moveX - gestureState.previousMoveX;
					const offset = this.getViewPager().getScrollOffsetFromCurrentPage();
					if (dx > 0 && offset > 0 && !this.shouldScrollViewPager(evt, gestureState)) {
						if (dx > offset) { // active image responder
							this.getViewPager().scrollByOffset(offset);
							gestureState.moveX -= offset;
							this._activeImageResponder(evt, gestureState);
						}
					} else if (dx < 0 && offset < 0 && !this.shouldScrollViewPager(evt, gestureState)) {
						if (dx < offset) { // active image responder
							this.getViewPager().scrollByOffset(offset);
							gestureState.moveX -= offset;
							this._activeImageResponder(evt, gestureState);
						}
					}
				}
				this.activeResponder.onMove(evt, gestureState);
			},
			onResponderRelease: onResponderReleaseOrTerminate,
			onResponderTerminate: onResponderReleaseOrTerminate,
			onResponderTerminationRequest: (evt, gestureState) => false, // Do not allow parent view to intercept gesture
			onResponderSingleTapConfirmed: (evt, gestureState) => {
				this.props.onSingleTapConfirmed && this.props.onSingleTapConfirmed(this.currentPage);
			}
		});

		this.viewPagerResponder = {
			onStart: (evt, gestureState) => {
				this.getViewPager()._onResponderGrant(evt, gestureState);
			},
			onMove: (evt, gestureState) => {
				this.getViewPager()._onResponderMove(evt, gestureState);
			},
			onEnd: (evt, gestureState, disableSettle) => {
				this.getViewPager()._onResponderRelease(evt, gestureState, disableSettle);
			}
		};

		this.imageResponder = {
			onStart: (evt, gestureState) => {
				this.callImageTransformer('_onResponderGrant', evt, gestureState );
				if (this.props.onLongPress) {
					this._longPressTimeout = setTimeout(() => {
						this.props.onLongPress(gestureState);
					}, 600);
				}
			},
			onMove: (evt, gestureState) => {
				this.callImageTransformer('_onResponderMove', evt, gestureState);
				clearTimeout(this._longPressTimeout);
			},
			onEnd: (evt, gestureState) => {
				this.callImageTransformer('_onResponderRelease', evt, gestureState);
				clearTimeout(this._longPressTimeout);
			}
		};
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	shouldScrollViewPager(evt, gestureState) {
		if (gestureState.numberActiveTouches > 1) {
			return false;
		}
		const viewTransformer = this.getCurrentImageTransformer();
		if (!viewTransformer) {
			return false;
		}

		const space = viewTransformer.getAvailableTranslateSpace();
		const dx = gestureState.moveX - gestureState.previousMoveX;

		if (dx > 0 && space.left <= 0 && this.currentPage > 0) {
			return true;
		}
		if (dx < 0 && space.right <= 0 && this.currentPage < this.pageCount - 1) {
			return true;
		}
		return false;
	}

	_activeImageResponder = (evt, gestureState) => {
		if (this.activeResponder !== this.imageResponder) {
			if (this.activeResponder === this.viewPagerResponder) {
				this.viewPagerResponder.onEnd(evt, gestureState, true); // pass true to disable ViewPager settle
			}
			this.activeResponder = this.imageResponder;
			this.imageResponder.onStart(evt, gestureState);
		}
	}

	activeViewPagerResponder(evt, gestureState) {
		if (this.activeResponder !== this.viewPagerResponder) {
			if (this.activeResponder === this.imageResponder) {
				this.imageResponder.onEnd(evt, gestureState);
			}
			this.activeResponder = this.viewPagerResponder;
			this.viewPagerResponder.onStart(evt, gestureState);
		}
	}

	getImageTransformer(page) {
		if (page >= 0 && page < this.pageCount) {
			let ref = this.imageRefs.get(page);
			if (ref) {
				return ref.getViewTransformerInstance();
			}
		}
	}

	callImageTransformer( method, event, state ){
		let transformer = this.getCurrentImageTransformer();

		return transformer && transformer[method]( event, state );
	}

	getCurrentImageTransformer() {
		return this.getImageTransformer(this.currentPage);
	}

	getViewPager() {
		return this.viewPager && this.viewPager.current;
	}

	_onPageSelected = pageIndex => {
		this.currentPage = pageIndex;
		this.props.onPageSelected && this.props.onPageSelected(pageIndex);
	}

	_onPageScrollStateChanged = state => {
		if (state === 'idle') {
			this.resetHistoryImageTransform();
		}
		this.props.onPageScrollStateChanged && this.props.onPageScrollStateChanged(state);
	}

	_renderPage = (pageData, pageIndex) => {
		const { onViewTransformed, onTransformGestureReleased, errorComponent, imageComponent } = this.props;

		return (
			<TransformableImage
				onViewTransformed={((transform) => {
					onViewTransformed && onViewTransformed(transform, pageIndex);
				})}
				onTransformGestureReleased={((transform) => {
					// need the 'return' here because the return value is checked in ViewTransformer
					return onTransformGestureReleased && onTransformGestureReleased(transform, pageIndex);
				})}
				ref={((ref) => { this.imageRefs.set(pageIndex, ref); })}
				key={'innerImage#' + pageIndex}
				errorComponent={errorComponent}
				imageComponent={imageComponent}
				image={pageData}
			/>
		);
	}

	resetHistoryImageTransform() {
		let transformer = this.getImageTransformer(this.currentPage + 1);
		if (transformer) {
			transformer.forceUpdateTransform({ scale: 1, translateX: 0, translateY: 0 });
		}

		transformer = this.getImageTransformer(this.currentPage - 1);
		if (transformer) {
			transformer.forceUpdateTransform({ scale: 1, translateX: 0, translateY: 0 });
		}
	}

	render() {
		let gestureResponder = this.gestureResponder;

		let images = this.props.images;
		if (!images) {
			images = [];
		}
		this.pageCount = images.length;

		if (this.pageCount <= 0) {
			gestureResponder = {};
		}

		const flatListProps = { ...DEFAULT_FLAT_LIST_PROPS, ...this.props.flatListProps };

		return (
			<ViewPager
				{...this.props}
				flatListProps={flatListProps}
				ref={ this.viewPager }
				scrollViewStyle={this.props.scrollViewStyle}
				scrollEnabled={false}
				renderPage={this._renderPage}
				pageDataArray={images}
				{...gestureResponder}
				onPageSelected={this._onPageSelected}
				onPageScrollStateChanged={this._onPageScrollStateChanged}
				onPageScroll={this.props.onPageScroll}
				removeClippedSubviews={this.props.removeClippedSubviews}
			/>
		);
	}
}
