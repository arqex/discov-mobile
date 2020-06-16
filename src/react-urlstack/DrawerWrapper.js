import React, {Component} from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import {animatedStyles} from './utils/animatedStyles'
import Interactable from 'react-interactable'

let handleWidth = 15

export default class DrawerWrapper extends Component {
	constructor(props){
		super(props);
	
		this.state = {
			open: props.initiallyOpen || false
		};

		// This will be true when we know the real width of the drawer
		this.layoutUpdated = false;
		this.drawerWidth = 300;
		
		this.drawerPos = new Animated.Value( props.initiallyOpen ? this.drawerWidth : 0 );
		this.calculateDrawerIndex();

		this.overlayAnimStyle = {
			transform: [{translateX: this.drawerIndex.interpolate({
				inputRange: [0, 0.01, 1],
				outputRange: [ -10000, 0, 0]
			})}],
			opacity: this.drawerIndex.interpolate({
				inputRange: [0,0,1,1],
				outputRange: [0,0,.5,.5]
			})
		}

		const drawerMethods = {
			open: () => this.openDrawer(),
			close: () => this.closeDrawer()
		}
		this._drawerMethods = drawerMethods
	}

	render(){
		let { Drawer, router, collapsible, navProps } = this.props
		let handle, overlay
		if( collapsible ){
			handle = <View style={ styles.handle } />
			overlay = (
			<Animated.View style={ [styles.overlay, this.overlayAnimStyle] }
				onClick={ () => this.closeDrawer() }>
			</Animated.View>
			)
		}

		let width = this.state.open ? this.drawerWidth * 2 : this.drawerWidth + handleWidth;
		let left = this.layoutUpdated ? - this.drawerWidth : -3000;

		let containerStyles = [
			styles.container,
			styles.collapsibleContainer,
			{width, left},
			this.animatedStyles
		]

		let drawerStyles = [
			styles.drawer,
			styles.collapsibleDrawer
		]

		let snapPoints = [
			{ x: 0, id: 'closed' }, {x: this.drawerWidth, id: 'open'}
		];

		return (
			<Animated.View style={ containerStyles }>
				{ overlay }
				<Interactable.View dragEnabled={ !!collapsible }
					ref="drawer"
					horizontalOnly={ true } snapPoints={ snapPoints }
					boundaries={{right: this.drawerWidth, bounce: 0}}
					onDrag={ e => this.onDrag( e ) }
					animatedValueX={ this.drawerPos }>
					<View style={ drawerStyles } ref="layout" onLayout={ e => this.updateLayout(e) }>
						<Drawer router={ router }
							drawer={ this._drawerMethods }
							layout={ this.props.layout }
							breakPoint={ this.props.breakPoint }
							indexes={{ transition: this.drawerIndex }}
							{ ...navProps } />
						{ handle }
					</View>
				</Interactable.View>
			</Animated.View>
		)
	}
	
	updateLayout( e ){
		let {layout} = e.nativeEvent;

		this.layoutUpdated = true;
		this.animatedStyles = animatedStyles(this.props.transition, this.props.indexes, layout );
		this.drawerWidth = Math.max( 0, layout.width - handleWidth );
		this.calculateDrawerIndex();
		this.forceUpdate();
	}

	componentDidUpdate(prevProps) {
		if( prevProps.collapsible !== this.props.collapsible ){
			this.drawerPos.setValue(0);
		}
		if( prevProps.breakPoint !== this.props.breakPoint ){
			this.refs.layout.measure( (dx, dy, width, height, x, y) => {
				this.updateLayout({ nativeEvent: {layout: {width, height, x, y}}});
			})
		}
	}

	calculateDrawerIndex(){
		let di = this.drawerIndex;

		if( this.state.open ){
			this.drawerPos.setValue( this.drawerWidth );
		}

		let index = this.drawerPos.interpolate({
			inputRange: [0, this.drawerWidth ],
			outputRange: [0, 1]
		})

		if( di ){
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
		this.setState({open: true})
		drawer && drawer.setVelocity({x: 3000})
	}

	closeDrawer(){
		if( !this.props.collapsible || !this.state.open ) return;

		let drawer = this.refs.drawer
		this.setState({open: false})
		drawer && drawer.setVelocity({x: -3000})
	}

	onDrag( e ){
		if( e.nativeEvent ) e = e.nativeEvent
		
		if( e.state === 'start' ){
			this.setState({open: true})
		}
		else if( e.state === 'end' && e.targetSnapPointId === 'closed' ){
			this.setState({open: false})
		}
	}
}

let styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	collapsibleContainer: {
    position: 'absolute',
		top: 0, bottom: 0,
		zIndex: 2000,
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
		top: 0, bottom: 0, right: 0,
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