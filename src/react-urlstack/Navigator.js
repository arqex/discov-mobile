import React, {Component} from 'react'
import PropTypes from 'prop-types'
import createRouter from 'urlstack'
import { Dimensions, View, StyleSheet, Animated, Platform, KeyboardAvoidingView, BackHandler } from 'react-native'
import ScreenStack from './ScreenStack'
import ModalWrapper from './ModalWrapper'
import DrawerWrapper from './DrawerWrapper'
import { SharedElementWrapper } from './utils/sharedElementContext'
import desktopTransition from './defaultTransitions/desktopTransition'
import mobileTransition from './defaultTransitions/mobileTransition'
import modalTransition from './defaultTransitions/modalTransition'
import {memoize} from './utils/utils'
import augmentRouter from './utils/augmentRouter';

const isWeb = Platform.OS === 'web'

let router = createRouter();
export {router};

export default class Navigator extends Component {
	constructor( props ){
		super( props )

		this.state = {
			layout: this.getWindowSize()
		};

		this.calculateTransition( props.transitions, this.state.layout.width )

		this.getScreenStack = memoize( this.getScreenStack )
		this._onBack = this._onBack.bind( this )

		this.drawer = {
			open: () => this.drawerInstance && this.drawerInstance.openDrawer(),
			close: () => this.drawerInstance && this.drawerInstance.closeDrawer(),
		}

		BackHandler.addEventListener( 'hardwareBackPress', this._onBack )
	}

	static propTypes = {
		transitions: PropTypes.object,
		interceptor: PropTypes.func,
		strategy: PropTypes.string
	}

	static defaultProps = {
		strategy: 'hash',
		transitions: {
			0: mobileTransition,
			800: desktopTransition
		}
	}

	render(){
		let router = this.router;
		if( !router ) {

			return null;
		}
		
		let { DrawerComponent, interceptor, routes, transitions, drawerInitiallyOpen, ...props } = this.props
		let { layout, indexes } = this.state
		
		let transition = this.currentTransition
		let breakPoint = this.currentBreakpoint
		let modalTransition = this.getModalTransitions( transition )
		let { stack, index } = this.getScreenStack( router.stack, router.activeIndex );


		return (
			<KeyboardAvoidingView behavior={ this.getKBBehavior() } style={{ flex: 1 }}>
				<SharedElementWrapper router={router} layout={layout}>
					<View style={ styles.windowWrapper }>
						<View style={styles.container} onLayout={ e => this._onLayout( e.nativeEvent.layout ) }>
							<ScreenStack router={router}
								animating={ this.state.animating }
								screenTransition={transition}
								stackTransition={modalTransition.stack}
								stackIndexes={indexes.stack}
								breakPoint={ breakPoint }
								stack={stack}
								index={index}
								layout={layout}
								drawer={this.drawer}
								navProps={props}/>
							<ModalWrapper router={router}
								animating={ this.state.animating }
								stack={router.modal.stack}
								index={router.modal.stack}
								transition={modalTransition.modal}
								breakPoint={ breakPoint }
								indexes={indexes.modal}
								layout={layout}
								drawer={this.drawer}
								navProps={props} />
							{this.renderDrawer(props)}
						</View>
					</View>
				</SharedElementWrapper>
			</KeyboardAvoidingView>
		)
	}

	renderDrawer( navProps ) {
		const DrawerComponent = this.props.DrawerComponent;
		if( !DrawerComponent ) return;

		return (
			<DrawerWrapper
				layout={ this.state.layout }
				ref={component => this.drawerInstance = component}
				router={ this.router }
				transition={ this.getModalTransitions( this.currentTransition ).drawer }
				breakPoint={ this.currentBreakpoint }
				indexes={ this.state.indexes.stack }
				collapsible={ this.currentTransition.collapsibleDrawer }
				Drawer={ DrawerComponent }
				initiallyOpen={ this.props.drawerInitiallyOpen }
				navProps={ navProps } />
		);
	}

	calculateTransition( transitions, width ){
		let breakPoints = Object.keys( transitions ).sort( (a,b) => a - b )
		let i = breakPoints.length
		
		while( i-- > 0 ){
			if( width >= parseInt( breakPoints[i]) ){
				this.currentTransition = transitions[ breakPoints[i] ]
				this.currentBreakpoint = parseInt(breakPoints[i]);
				return;
			}
		}
		
		this.currentTransition = transitions[ breakPoints[0] ]
		this.currentBreakpoint = parseInt(breakPoints[0]);
	}

	getModalTransitions( transition ){
		let t = transition || this.currentTransition;
		return t.modalTransition || modalTransition
	}

	// Takes the modal screens out of the stack
	getScreenStack( routerStack, routerIndex ){
		let stack = routerStack.slice();
		let index = routerIndex;
		
		if( !stack.length ){
			return {stack, index};
		}
		
		let lastIndex = routerStack.length - 1;
		let last = stack[ lastIndex ]
		let options = last.Screen.urlstackOptions || {}

		if( options.modal ){
			stack.pop()
			if( index === lastIndex ){
				index--;
			}
		}

		return {stack, index}
	}

	startRouter(){
		router.setStrategy( this.props.strategy );
		router.setRoutes( this.props.routes );

		let interceptor = this.props.interceptor;
		if( interceptor ){
			router.onBeforeChange( interceptor );
		}

		this.fu = () => this.forceUpdate();
		router.onChange( this.fu );
		router.start();

		this.router = router;

		augmentRouter( router );

		this.showingModal = this.detectModal();
		this.updateModalIndexes( this.showingModal );
	}

	getWindowSize(){
		let { width, height } = Dimensions.get('window')
		return { 
			width, height, x: 0, y: 0
		}
	}

	componentDidMount() {
		this.startRouter();
	}

	componentWillUnmount() {
		this.unmounted = true;
		router.urlhub.offChange( this.fu );
		router.urlhub.offBeforeChange( this.props.interceptor );
		BackHandler.removeEventListener( 'hardwareBackPress', this._onBack )
	}

	componentDidUpdate( prevProps ){
		let showModal = this.detectModal()
		if( this.showingModal !== showModal ){
			this.showingModal = showModal;
			this.updateModalIndexes( showModal );
		}

		if( prevProps.transistions !== this.props.transistions ){
			this.calculateTransition( this.props.transitions, this.state.layout.width )
		}
	}

	getKBBehavior(){
		return Platform.OS === 'ios' ? 'padding' : undefined;
	}

	_onLayout( layout ){
		if( this.unmounted ) return;

		this.calculateTransition( this.props.transitions, layout.width )
		this.setState( {layout} )
	}

	_onBack(){
		let router = this.router;
		let stack = router.stack;
		let nextRoute;
		if( router.modal.active ){
			if( router.modal.activeIndex ){
				nextRoute = router.modal.stack[ router.modal.activeIndex - 1 ].path
			}
			else {
				nextRoute = stack[ router.activeIndex ].location
				nextRoute = nextRoute.pathname + nextRoute.search
			}
		}
		else if( router.activeIndex ){
			nextRoute = stack[ router.activeIndex - 1 ].path
		}

		if( nextRoute ){
			router.navigate( nextRoute )
			return true; // Prevents getting out of the app
		}
	}

	detectModal(){
		return this.router.modal.active;
	}

	updateModalIndexes( showModal ){
		let stateUpdate = {};
		let indexes = this.state.indexes;

		if( !indexes ){
			indexes = {
				modal: {showing: !!showModal, transition: new Animated.Value( showModal ? 1 : 0) },
				stack: {showing: !showModal, transition: new Animated.Value( showModal ? 0 : 1) }
			}
		}
		else {
			let transitions = this.getModalTransitions()

			stateUpdate = {animating: true};

			indexes = {
				modal: {showing: !!showModal, transition: indexes.modal.transition },
				stack: {showing: !showModal, transition: indexes.stack.transition }
			}

			Animated.timing( indexes.modal.transition, {
				toValue: showModal ? 1 : 0,
				easing: transitions.modal.easing,
				duration: transitions.modal.duration || 300,
				useNativeDriver: !isWeb
			}).start()

			Animated.timing( indexes.stack.transition, {
				toValue: showModal ? 0 : 1,
				easing: transitions.stack.easing,
				duration: transitions.stack.duration || 300,
				useNativeDriver: !isWeb
			}).start( () => this.setState( this._endAnimation ));
		}

		stateUpdate.indexes = indexes;
		this.setState( stateUpdate )
	}
	
	_endAnimation = () => {
		// This is called as the last Animated frame is triggered
		// wait a bit until that frame is reflected in the UI
		setTimeout( () => {
			this.setState({ animating: false }, () => {
				this.forceUpdate();
			})
		}, 16);
	}
}

// let statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

let styles = StyleSheet.create({
	windowWrapper: {
		flex: 1,
	},

	container: {
		flex: 1,
		flexDirection: 'row',
		overflow: 'hidden'
	},
})