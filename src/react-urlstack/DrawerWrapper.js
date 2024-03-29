import React, { Component } from 'react'
import { StyleSheet, Animated, View, Keyboard } from 'react-native'
import { animatedStyles } from './utils/animatedStyles'
import Interactable from 'react-native-interactable'
import DeviceInfo from 'react-native-device-info'

let handleWidth = 15

export default class DrawerWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: props.initiallyOpen || false
		};

		// This will be true when we know the real width of the drawer
		let layout = props.layout;

		this.drawerWidth = layout.width;
		this.drawerPos = new Animated.Value(props.initiallyOpen ? this.drawerWidth : 0);
		// If we don't provide an animatedY to rn-interactable it returns errors
		this.animatedY = new Animated.Value(0);
		this.calculateDrawerIndex();

		this.animatedStyles = animatedStyles(props.transition, props.indexes, props.layout);

		this.overlayAnimStyle = {
			transform: [{
				translateX: this.drawerIndex.interpolate({
					inputRange: [0, 0.01, 1],
					outputRange: [-10000, 0, 0]
				})
			}],
			opacity: this.drawerIndex.interpolate({
				inputRange: [0, 0, 1, 1],
				outputRange: [0, 0, .5, .5]
			})
		}

		const drawerMethods = {
			open: () => this.openDrawer(),
			close: () => this.closeDrawer()
		}
		this._drawerMethods = drawerMethods
	}

	render() {
		let { Drawer, router, collapsible, navProps } = this.props
		let handle, overlay

		if (collapsible) {
			handle = <View style={styles.handle} />
			overlay = (
				<Animated.View style={[styles.overlay, this.overlayAnimStyle]}
					onClick={() => this.closeDrawer()}>
				</Animated.View>
			)
		}

		let width = this.state.open ? this.drawerWidth * 2 : this.drawerWidth + handleWidth;
		let left = 0 - this.drawerWidth;

		let containerStyles = [
			styles.container,
			styles.collapsibleContainer,
			{ width, left }
		]

		let drawerStyles = [
			styles.drawer,
			styles.collapsibleDrawer
		]

		let snapPoints = [
			{ x: 0, id: 'closed' }, { x: this.drawerWidth, id: 'open' }
		];

		return (
			<View style={containerStyles}>
				{overlay}
				<Interactable.View
					dragEnabled={!!collapsible }
					ref="drawer"
					horizontalOnly={true}
					snapPoints={snapPoints}
					boundaries={{ right: this.drawerWidth, bounce: 0 }}
					onDrag={e => this.onDrag(e)}
					animatedNativeDriver={true}
					initialPosition={{x: this.drawerPos._value, y: 0}}
					animatedValueX={ this.drawerPos }
					animatedValueY={ this.animatedY } >
					<View style={drawerStyles} ref="layout">
						<Drawer router={router}
							drawer={this._drawerMethods}
							layout={this.props.layout}
							breakPoint={this.props.breakPoint}
							indexes={{ transition: this.drawerIndex }}
							{...navProps} />
						{handle}
					</View>
				</Interactable.View>
			</View>
		)
	}

	_updateLayout = e => {
		let { layout } = e.nativeEvent;

		this.animatedStyles = animatedStyles(this.props.transition, this.props.indexes, layout);
		this.drawerWidth = Math.max(0, layout.width);

		this.calculateDrawerIndex();
		this.forceUpdate();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.collapsible !== this.props.collapsible) {
			this.drawerPos.setValue(0);
		}
		if (prevProps.breakPoint !== this.props.breakPoint) {
			this.refs.layout.measure((dx, dy, width, height, x, y) => {
				this._updateLayout({ nativeEvent: { layout: { width, height, x, y } } });
			})
		}
	}

	calculateDrawerIndex() {
		let di = this.drawerIndex;

		if (this.state.open) {
			this.drawerPos.setValue( this.drawerWidth );
		}

		let index = this.drawerPos.interpolate({
			inputRange: [0, this.drawerWidth],
			outputRange: [0, 1]
		})

		if (di) {
			di._config = index._config;
			di._interpolation = index._interpolation;
		}
		else {
			this.drawerIndex = index;
		}
	}

	openDrawer(){
		if( !this.props.collapsible || this.state.open ) return;

		let drawer = this.refs.drawer
		this.setState({open: true});

		Keyboard.dismiss();

		return drawer && drawer.snapTo({index: 1});

		if( this.isAndroidEmulator() ){
			return this.openEmulatorDrawer();
		}
		else {
			drawer && drawer.snapTo({index: 1});
		}
	}

	closeDrawer(){
		if( !this.props.collapsible || !this.state.open ) return;

		let drawer = this.refs.drawer
		this.setState({open: false})

		return drawer && drawer.snapTo({index: 0});

		if( this.isAndroidEmulator() ){
			return this.closeEmulatorDrawer();
		}
		else {
			drawer && drawer.snapTo({index: 0});
		}
	}

	onDrag( e ){
		if( e.nativeEvent ) e = e.nativeEvent
		
		if( e.state === 'start' ){
			Keyboard.dismiss();
			this.setState({open: true})
		}
		else if( e.state === 'end' && e.targetSnapPointId === 'closed' ){
			this.setState({open: false})
		}
	}

	isAndroidEmulator() {
		return DeviceInfo.isEmulatorSync() && Platform.OS === 'android';
	}

	openEmulatorDrawer(){
		this.drawerPos.setValue( this.drawerWidth );
	}

	closeEmulatorDrawer(){
		this.drawerPos.setValue( 0 );
	}
}

let styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	collapsibleContainer: {
		position: 'absolute',
		top: 0, bottom: 0,
		zIndex: 10,
	},
	drawer: {
		// position: 'absolute',
		top: 0, left: 0,
		height: '100%', width: '100%',
		flex: 1
	},
	collapsibleDrawer: {
		left: 0,
		width: '100%',
		flex: 1,
		position: 'relative',
		zIndex: 20000,
		paddingRight: handleWidth
	},
	handle: {
		width: handleWidth,
		top: 100, bottom: 0, right: 0,
		// backgroundColor: 'green',
		position: 'absolute',
		zIndex: 10
	},
	overlay: {
		backgroundColor: 'black',
		height: '100%',
		width: '400%',
		position: 'absolute'
	},
	expander: {
		position: 'absolute',
		height: '100%',
		top: 0, left: 0, bottom: 0
	}
})