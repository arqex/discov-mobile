import * as React from 'react';
import { ViewProps, ViewStyle, PanResponderGestureState, FlatListProps, GestureResponderEvent } from 'react-native';
import { createResponder } from './utils/GestureResponder';
import TransformableImage, {TransformableImageData} from './components/TransformableImage';
import ViewPager, { PagerScrollEvent } from './components/ViewPager';
import { TransformEvent } from './components/ViewTransformer';

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
	onViewTransformed?: (event: TransformEvent, pageIndex: number) => any,
	onTransformGestureReleased?: (event: TransformEvent, pageIndex: number) => any,
	removeClippedSubview?: boolean,
	errorComponent?: React.ComponentType | React.FunctionComponent,
	imageComponent?: React.ComponentType | React.FunctionComponent,
	flatListProps?: FlatListProps<any>
}


export default class Gallery extends React.PureComponent<GalleryProps> {
	static defaultProps = {
		removeClippedSubviews: true,
		imageComponent: undefined,
		scrollViewStyle: {},
		flatListProps: DEFAULT_FLAT_LIST_PROPS,
		onPageSelected: nofn,
		onGalleryStateChanged: nofn,
		onLongPress: nofn,
		onPageScrollStateChanged: nofn,
		onViewTransformed: nofn,
		onTransformGestureReleased: nofn,
		onSingleTapConfirmed: nofn
	};

	imageRefs = new Map();
	activeResponder = undefined;
	firstMove = true;
	currentPage = 0;
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
		this.gestureResponder = createResponder({
			onStartShouldSetResponderCapture: (evt, gestureState) => true,
			onStartShouldSetResponder: (evt, gestureState) => true,
			onResponderGrant: this._activateImageResponder,
			onResponderMove: this._onResponderMove,
			onResponderRelease: this._onResponderRelease,
			onResponderTerminate: this._onResponderRelease,
			onResponderTerminationRequest: () => false, // Do not allow parent view to intercept gesture
			onResponderSingleTapConfirmed: () => this.props.onSingleTapConfirmed(this.currentPage)
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
				this.callImageTransformer('_onResponderGrant', evt, gestureState);
				this._longPressTimeout = setTimeout(() => {
					this.props.onLongPress(gestureState);
				}, 600);
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

	_activateImageResponder = (evt, gestureState) => {
		if (this.activeResponder !== this.imageResponder) {
			if (this.activeResponder === this.viewPagerResponder) {
				this.viewPagerResponder.onEnd(evt, gestureState, true); // pass true to disable ViewPager settle
			}
			this.activeResponder = this.imageResponder;
			this.imageResponder.onStart(evt, gestureState);
		}
	}

	_onResponderMove = (evt, gestureState) => {
		if (this.firstMove) {
			this.firstMove = false;
			if (this.shouldScrollViewPager(evt, gestureState)) {
				this.activateViewPagerResponder(evt, gestureState);
			}
			this.props.onGalleryStateChanged(false);
		}

		if (this.activeResponder === this.viewPagerResponder && !this.shouldScrollViewPager(evt, gestureState)) {
			const dx = gestureState.moveX - gestureState.previousMoveX;
			const offset = this.getViewPager().getScrollOffsetFromCurrentPage();
			if (this.isDeltaBiggerThanOffset(dx, offset)) {
				this.getViewPager().scrollByOffset(offset);
				gestureState.moveX -= offset;
				this._activateImageResponder(evt, gestureState);
			}
		}

		this.activeResponder.onMove(evt, gestureState);
	}

	_onResponderRelease = (evt, gestureState) => {
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
		this.props.onGalleryStateChanged(true);
	};

	isDeltaBiggerThanOffset(d, offset) {
		return (
			d > 0 && offset > 0 && d > offset ||
			d < 0 && offset < 0 && d < offset
		);
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
		if (dx < 0 && space.right <= 0 && this.currentPage < this.props.images.length - 1) {
			return true;
		}

		return false;
	}

	activateViewPagerResponder(evt, gestureState) {
		if (this.activeResponder !== this.viewPagerResponder) {
			if (this.activeResponder === this.imageResponder) {
				this.imageResponder.onEnd(evt, gestureState);
			}
			this.activeResponder = this.viewPagerResponder;
			this.viewPagerResponder.onStart(evt, gestureState);
		}
	}

	getImageTransformer(page) {
		if (page >= 0 && page < this.props.images.length) {
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
		this.props.onPageSelected(pageIndex);
	}

	_onPageScrollStateChanged = state => {
		if (state === 'idle') {
			this.resetHistoryImageTransform();
		}
		this.props.onPageScrollStateChanged(state);
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
		let images = this.props.images;
		let gestureResponder = images.length ? this.gestureResponder : {};
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

	_renderPage = (pageData, pageIndex) => {
		const { onViewTransformed, onTransformGestureReleased, errorComponent, imageComponent } = this.props;	
		return (
			<TransformableImage
				onViewTransformed={transform => onViewTransformed(transform, pageIndex)}
				onTransformGestureReleased={transform => onTransformGestureReleased(transform, pageIndex)}
				ref={ref => this.imageRefs.set(pageIndex, ref)}
				key={'innerImage#' + pageIndex}
				errorComponent={errorComponent}
				imageComponent={imageComponent}
				image={pageData}
			/>
		);
	}
}

function nofn(){}
