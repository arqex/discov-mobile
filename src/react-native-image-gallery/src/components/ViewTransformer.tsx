import * as React from 'react';
import ReactNative, { View, Animated, Easing, NativeModules, LayoutChangeEvent, ViewProps } from 'react-native';
import Scroller from '../utils/Scroller';
import { createResponder } from '../utils/GestureResponder';
import { Rect, Transform, transformedRect, availableTranslateSpace, fitCenterRect, alignedRect, getTransform } from '../utils/TransformUtils';

export interface TransformEvent {
	scale: number,
	translateX: number,
	translateY: number
}

interface ViewTransformerProps extends ViewProps {
	enableTransform?: boolean,
	enableScale?: boolean,
	enableTranslate?: boolean,
	maxOverScrollDistance?: number,
	maxScale?: number,
	contentAspectRatio: number,
	enableResistance?: boolean,
	onViewTransformed?: (event: TransformEvent) => any,
	onTransformGestureReleased?: (event: TransformEvent) => any,
	onSingleTapConfirmed?: () => any,
	onLayout?: (event: LayoutChangeEvent) => any,
	onTransformStart?: () => any,
	children: React.ReactNode
}

export default class ViewTransformer extends React.Component<ViewTransformerProps> {
	static Rect = Rect;
	static getTransform = getTransform;

	static defaultProps = {
		maxOverScrollDistance: 20,
		enableScale: true,
		enableTranslate: true,
		enableTransform: true,
		maxScale: 1,
		enableResistance: false,
		onSingleTapConfirmed: nofn,
		contentAspectRatio: 1
	};

	_viewPortRect = new Rect();
	animator = new Animated.Value(0);

	state = {
		// transform state
		scale: 1,
		translateX: 0,
		translateY: 0,
		// layout
		width: 0,
		height: 0,
		pageX: 0,
		pageY: 0
	}

	scroller = this.createScroller()
	gestureResponder = this.createGestureResponder()

	innerView = React.createRef<View>()

	createScroller() {
		return new Scroller(true, (dx, dy, scroller) => {
			if (dx === 0 && dy === 0 && scroller.isFinished()) {
				this.animateBounce();
				return;
			}

			this.updateTransform({
				translateX: this.state.translateX + dx / this.state.scale,
				translateY: this.state.translateY + dy / this.state.scale
			});
		});
	}

	createGestureResponder() {
		return createResponder({
			onStartShouldSetResponder: () => true,
			onMoveShouldSetResponderCapture: () => true,
			onResponderMove: this._onResponderMove,
			onResponderGrant: this._onResponderGrant,
			onResponderRelease: this._onResponderRelease,
			onResponderTerminate: this._onResponderRelease,
			onResponderTerminationRequest: () => false, // Do not allow parent view to intercept gesture
			onResponderSingleTapConfirmed: this.props.onSingleTapConfirmed
		});
	}

	viewPortRect() {
		this._viewPortRect.set(0, 0, this.state.width, this.state.height);
		return this._viewPortRect;
	}

	getContentRect() {
		return fitCenterRect(
			this.props.contentAspectRatio, this.viewPortRect().copy()
		);
	}

	getTransformedContentRect() {
		return fitCenterRect(
			this.props.contentAspectRatio,
			transformedRect(this.viewPortRect(), this.currentTransform())
		);
	}

	currentTransform() {
		return new Transform(this.state.scale, this.state.translateX, this.state.translateY);
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.onViewTransformed && this.props.onViewTransformed({
			scale: this.state.scale,
			translateX: this.state.translateX,
			translateY: this.state.translateY
		});
	}

	componentWillUnmount() {
		this.cancelAnimation();
	}

	render() {
		let gestureResponder = this.gestureResponder;
		if (!this.props.enableTransform) {
			gestureResponder = {};
		}

		return (
			<View
				{...this.props}
				{...gestureResponder}
				ref={this.innerView}
				onLayout={this._onLayout}>
				<View
					style={{
						flex: 1,
						transform: [
							{ scale: this.state.scale },
							{ translateX: this.state.translateX },
							{ translateY: this.state.translateY }
						]
					}}>
					{this.props.children}
				</View>
			</View>
		);
	}

	_onLayout = e => {
		const { width, height } = e.nativeEvent.layout;
		if (width !== this.state.width || height !== this.state.height) {
			this.setState({ width, height });
		}
		this.measureLayout();

		this.props.onLayout && this.props.onLayout(e);
	}

	measureLayout() {
		let handle = ReactNative.findNodeHandle(this.innerView.current);
		NativeModules.UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
			if (typeof pageX === 'number' && typeof pageY === 'number') { // avoid undefined values on Android devices
				if (this.state.pageX !== pageX || this.state.pageY !== pageY) {
					this.setState({ pageX: pageX, pageY: pageY });
				}
			}
		});
	}

	_onResponderGrant = (evt, gestureState) => {
		this.props.onTransformStart && this.props.onTransformStart();
		this.setState({ responderGranted: true });
		this.measureLayout();
	}

	_onResponderMove = (evt, gestureState) => {
		this.cancelAnimation();

		let dx = gestureState.moveX - gestureState.previousMoveX;
		let dy = gestureState.moveY - gestureState.previousMoveY;
		if (this.props.enableResistance) {
			let d = this.applyResistance(dx, dy);
			dx = d.dx;
			dy = d.dy;
		}

		if (!this.props.enableTranslate) {
			dx = dy = 0;
		}

		let transform: any = {};
		if (gestureState.previousPinch && gestureState.pinch && this.props.enableScale) {
			let scaleBy = gestureState.pinch / gestureState.previousPinch;
			let pivotX = gestureState.moveX - this.state.pageX;
			let pivotY = gestureState.moveY - this.state.pageY;

			let rect = transformedRect(
				transformedRect(
					this.getContentRect(),
					this.currentTransform()
				),
				new Transform(scaleBy, dx, dy, { x: pivotX, y: pivotY })
			);
			transform = getTransform(this.getContentRect(), rect);
		} else {
			if (Math.abs(dx) > 2 * Math.abs(dy)) {
				dy = 0;
			} else if (Math.abs(dy) > 2 * Math.abs(dx)) {
				dx = 0;
			}
			transform.translateX = this.state.translateX + dx / this.state.scale;
			transform.translateY = this.state.translateY + dy / this.state.scale;
		}

		this.updateTransform(transform);
		return true;
	}

	_onResponderRelease = (evt, gestureState) => {
		let handled = this.props.onTransformGestureReleased && this.props.onTransformGestureReleased({
			scale: this.state.scale,
			translateX: this.state.translateX,
			translateY: this.state.translateY
		});
		if (handled) {
			return;
		}

		if (gestureState.doubleTapUp) {
			if (!this.props.enableScale) {
				this.animateBounce();
				return;
			}
			let pivotX = 0;
			let pivotY = 0;
			if (gestureState.dx || gestureState.dy) {
				pivotX = gestureState.moveX - this.state.pageX;
				pivotY = gestureState.moveY - this.state.pageY;
			} else {
				pivotX = gestureState.x0 - this.state.pageX;
				pivotY = gestureState.y0 - this.state.pageY;
			}

			this.performDoubleTapUp(pivotX, pivotY);
		} else {
			if (this.props.enableTranslate) {
				this.performFling(gestureState.vx, gestureState.vy);
			} else {
				this.animateBounce();
			}
		}
	}

	performFling(vx, vy) {
		let startX = 0;
		let startY = 0;
		let maxX, minX, maxY, minY;
		let availablePanDistance = availableTranslateSpace(this.getTransformedContentRect(), this.viewPortRect());
		if (vx > 0) {
			minX = 0;
			if (availablePanDistance.left > 0) {
				maxX = availablePanDistance.left + this.props.maxOverScrollDistance;
			} else {
				maxX = 0;
			}
		} else {
			maxX = 0;
			if (availablePanDistance.right > 0) {
				minX = -availablePanDistance.right - this.props.maxOverScrollDistance;
			} else {
				minX = 0;
			}
		}
		if (vy > 0) {
			minY = 0;
			if (availablePanDistance.top > 0) {
				maxY = availablePanDistance.top + this.props.maxOverScrollDistance;
			} else {
				maxY = 0;
			}
		} else {
			maxY = 0;
			if (availablePanDistance.bottom > 0) {
				minY = -availablePanDistance.bottom - this.props.maxOverScrollDistance;
			} else {
				minY = 0;
			}
		}

		vx *= 1000; // per second
		vy *= 1000;
		if (Math.abs(vx) > 2 * Math.abs(vy)) {
			vy = 0;
		} else if (Math.abs(vy) > 2 * Math.abs(vx)) {
			vx = 0;
		}

		this.scroller.fling(startX, startY, vx, vy, minX, maxX, minY, maxY);
	}

	performDoubleTapUp(pivotX, pivotY) {
		let curScale = this.state.scale;
		let scaleBy;
		if (curScale > (1 + this.props.maxScale) / 2) {
			scaleBy = 1 / curScale;
		} else {
			scaleBy = this.props.maxScale / curScale;
		}

		let rect = transformedRect(
			this.getTransformedContentRect(),
			new Transform(scaleBy, 0, 0, { x: pivotX, y: pivotY })
		);
		rect = transformedRect(
			rect,
			new Transform(
				1,
				this.viewPortRect().centerX() - pivotX,
				this.viewPortRect().centerY() - pivotY
			)
		);
		rect = alignedRect(rect, this.viewPortRect());
		this.animate(rect);
	}

	applyResistance(dx, dy) {
		let availablePanDistance = availableTranslateSpace(this.getTransformedContentRect(), this.viewPortRect());

		if ((dx > 0 && availablePanDistance.left < 0) ||
			(dx < 0 && availablePanDistance.right < 0)) {
			dx /= 3;
		}
		if ((dy > 0 && availablePanDistance.top < 0) ||
			(dy < 0 && availablePanDistance.bottom < 0)) {
			dy /= 3;
		}
		return { dx, dy };
	}

	cancelAnimation() {
		this.animator.stopAnimation();
	}

	animate(targetRect, duration = 200) {
		let fromRect = this.getTransformedContentRect();
		if (fromRect.equals(targetRect, 0.01)) {
			return;
		}

		this.animator.removeAllListeners();
		this.animator.setValue(0);
		this.animator.addListener((state) => {
			let progress = state.value;

			let left = fromRect.left + (targetRect.left - fromRect.left) * progress;
			let right = fromRect.right + (targetRect.right - fromRect.right) * progress;
			let top = fromRect.top + (targetRect.top - fromRect.top) * progress;
			let bottom = fromRect.bottom + (targetRect.bottom - fromRect.bottom) * progress;

			let transform = getTransform(this.getContentRect(), new Rect(left, top, right, bottom));
			this.updateTransform(transform);
		});

		Animated.timing(
			this.animator,
			{
				toValue: 1,
				duration: duration,
				easing: Easing.inOut(Easing.ease)
			}
		).start();
	}

	animateBounce() {
		let curScale = this.state.scale;
		let minScale = 1;
		let maxScale = this.props.maxScale;
		let scaleBy = 1;
		if (curScale > maxScale) {
			scaleBy = maxScale / curScale;
		} else if (curScale < minScale) {
			scaleBy = minScale / curScale;
		}

		let rect = transformedRect(
			this.getTransformedContentRect(),
			new Transform(
				scaleBy,
				0,
				0,
				{
					x: this.viewPortRect().centerX(),
					y: this.viewPortRect().centerY()
				}
			)
		);
		rect = alignedRect(rect, this.viewPortRect());
		this.animate(rect);
	}

	updateTransform(transform) {
		this.setState(transform);
	}

	forceUpdateTransform(transform) {
		this.setState(transform);
	}

	getAvailableTranslateSpace() {
		return availableTranslateSpace(this.getTransformedContentRect(), this.viewPortRect());
	}
}


function nofn() { }