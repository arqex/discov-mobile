import React, {Component, createRef} from 'react'
import PropTypes from 'prop-types'
import {Animated, View, StyleSheet, Platform} from 'react-native'
import {memoize, bind} from './utils/utils'
import ScreenWrapper from './ScreenWrapper'
import {animatedStyles} from './utils/animatedStyles'
import {Context} from './utils/sharedElementContext'

const isWeb = Platform.OS === 'web'

export default class ScreenStack extends Component {
	static propTypes = {
		router: PropTypes.object,
		screenTransition: PropTypes.object,
		stackTransition: PropTypes.object,
		stackIndexes: PropTypes.object,
		stack: PropTypes.array,
		index: PropTypes.number,
		layout: PropTypes.object
	}

	static defaultProps = {
		stackTransition: {},
		stackIndexes: {} 
	}

	static contextType = Context;

	constructor( props ){
		super( props );
		
		let { stack, index } = props

		this.state = {
			indexes: this.calculateIndexes({}, stack, index ),
			layout: false
		}

		this.screenRefs = {};

		this.previousIndex = index;
		this.previousScreen = stack[index] && stack[index].key;

		// memoize a couple of methods
		this.calculateIndexes = memoize( this.calculateIndexes.bind( this ) )
		this.updateRelativeIndexes = memoize( this.updateRelativeIndexes.bind( this ) )

		// Track the screens that are ready for transitions
		// the one who have already a layout
		this.readyScreens = {}

		bind( this, ['_onScreenReady', '_onScreenUnmount'] );
	}

	render(){
		let { stack, router } = this.props
		let containerStyles = [
			styles.container,
			this.animatedStyles
		]

		return (
			<Animated.View style={containerStyles}>
				<View style={styles.stack} onLayout={ e => this.updateLayout(e) }>
					{ this.renderScreens(router, stack) }
				</View>
			</Animated.View>
		)
	}
	
	renderScreens( router, stack ){
		let { layout, indexes } = this.state
		
		// Wait for the layout to be drawn
		if( !layout ) return;

		let screens = [];
		let isShowing = this.props.stackIndexes.showing;
		stack.forEach( item => {
			let key = item.key;

			if( !indexes[key] ) {
				// We are probably rebuilding indexes after navigating
				return;
			}

			if( !this.screenRefs[key] ){
				this.screenRefs[key] = createRef()
			}

			screens.push(
				<ScreenWrapper item={ item }
					animating={ this.props.animating || this.state.animating }
					ref={ this.screenRefs[key] }
					ScreenStack={ ScreenStack }
					router={ router }
					indexes={ indexes[ key ] }
					layout={ layout }
					transition={ this.getScreenTransition( item.Screen ) }
					onReady={ this._onScreenReady }
					onUnmount={ this._onScreenUnmount }
					drawer={ this.props.drawer }
					breakPoint={ this.props.breakPoint }
					key={ key }
					isShowing={ isShowing }
					navProps={ this.props.navProps } />
			)
		})

		return screens;
	}

	getScreenTransition( Screen ){
		if( typeof Screen.getTransition === 'function' ){
			let transition = Screen.getTransition( this.props.breakPoint );
			if( transition === false ) return;
			if( transition ) return transition;
		}

		return this.props.screenTransition;
	}

	updateLayout( e ){
		this.setState({ layout: e.nativeEvent.layout });
		this.animatedStyles = animatedStyles(this.props.stackTransition, this.props.stackIndexes, e.nativeEvent.layout )
	}

	componentDidUpdate( prevProps ) {
		let { stack, index, screenTransition } = this.props
		let indexes = this.calculateIndexes( this.state.indexes, stack, this.previousIndex, screenTransition )

		// Check if the indexes has changed
		if( indexes !== this.state.indexes ){
			this.setState( { indexes } );
		}
		
		// If the flag needRelativeUpdate is up, we need to update the relative
		// indexes to start the animations
		if (this.needRelativeUpdate) {
			
			// All the shared elements have been mounted, measure them ASAP
			this.context.reMeasure(
				this.props.layout,
				this.props.breakPoint,
				this.transitionIndexes
			);

			// Unset the transitionIndexes now
			this.transitionIndexes = false;

			// Calculate next indexes
			let nextIndexes = this.updateRelativeIndexes(indexes, stack, index);

			// At the next tick we can update the indexes and start the animations
			setTimeout( () => {
				this.needRelativeUpdate = false;
				this.startTransition( this.state.indexes, nextIndexes );
				this.setState({ indexes: nextIndexes })
			})
		}

		// We can init without setting the routes so maybe we don't have a screen just yet
		let screen = stack[index];
		if( !screen ) return;

		// If the pointer to the current screen has changed we need to start
		// the animations at the next tick, so raise the flag needRelativeUpdate
		if( index !== this.previousIndex || screen.key !== this.previousScreen ){
			this.transitionIndexes = {
				leaving: this.previousIndex,
				entering: index
			}
			this.needRelativeUpdate = true;
			this.previousIndex = index;
			this.previousScreen = screen.key;
			this.forceUpdate();
		}

		let prevShowing = prevProps.stackIndexes.showing;
		let nextShowing = this.props.stackIndexes.showing;
		if( prevShowing && !nextShowing ){
			this.triggerCycleMethod( this.getCurrentItem(), 'componentWillLeave' );
		}
		if( !prevShowing && nextShowing ){
			this.triggerCycleMethod( this.getCurrentItem(), 'componentWillEnter' );
		}
	}

	/**
	 * Calculate new indexes based on the previous one and the stack.
	 * If there are no changes in the indexes, returns oldIndexes.
	 */
	calculateIndexes( oldIndexes, stack, activeIndex ){
		let count = stack.length
		let indexes = { ...oldIndexes }
		let unusedIndexes = { ...oldIndexes }
		let updated = false;

		stack.forEach( ({ key }, i) => {
			if( unusedIndexes[key] ){
				return delete unusedIndexes[key]
			}

			updated = true;

			indexes[ key ] = {
				screen: i,
				count: count,
				relative: activeIndex - i,
				transition: new Animated.Value( activeIndex - i ),
				parent: this.props.parentIndexes
			}
		})

		// Delete tranistions not used
		Object.keys( unusedIndexes ).forEach( key => {
			delete indexes[key]
			delete this.screenRefs[key]
			updated = true;
		})

		return updated ? indexes : oldIndexes
	}
	
	/**
	 * Updates the relative index and the transitions.
	 * Needs to be called when the activeIndex changes.
	 */
	updateRelativeIndexes( oldIndexes, stack, activeIndex ){
		let indexes =  { ...oldIndexes }
		let count = stack.length

		stack.forEach( ({key}, i) => {
			let index = {
				screen: i,
				count: count,
				relative: activeIndex - i,
				transition: indexes[key].transition,
				parent: this.props.parentIndexes
			}

			indexes[key] = index;
		})

		return indexes;
	}

	startTransition( prevIndexes, nextIndexes ){
		let prevItem, nextItem, toIndex;

		// Screen transitions
		this.props.stack.forEach( item  => {
			let { key, Screen } = item;

			let prevIndex = prevIndexes[key];
			let nextIndex = nextIndexes[key];

			if( prevIndex.relative === 0 ){
				prevItem = item;
			}
			if( nextIndex.relative === 0 ){
				nextItem = item;
				toIndex = prevIndex.relative;
			}

			if( prevIndex && nextIndex && prevIndex.relative !== nextIndex.relative) {
				this.setState({animating: true});
				let transition = this.getScreenTransition( Screen );				

				Animated.timing( nextIndex.transition, {
					toValue: nextIndex.relative,
					easing: transition.easing,
					duration: transition.duration || 300,
					useNativeDriver: !isWeb,
				}).start( this._endAnimation )
			}
		})

		// Signal for shared elements transition to start
		if (prevItem && nextItem && prevItem !== nextItem ) {
			if( this.props.stackIndexes.showing ){
				this.triggerCycleMethod( prevItem, 'componentWillLeave' );
				this.triggerCycleMethod( nextItem, 'componentWillEnter' );
			}

			this.context.startTransition(
				this.getActiveScreens(prevItem),
				this.getActiveScreens(nextItem),
				toIndex,
				prevItem.Screen.getTransition
			);
		}
	}

	_endAnimation = () => {
		// This is called as the last Animated frame is triggered
		// wait a bit until that frame is reflected in the UI
		setTimeout(() => {
			this.setState({ animating: false }, () => {
				this.forceUpdate();
			})
		}, 16);
	}

	getActiveScreens( item ){
		let keys = [item.key]
		let tabs = item.tabs

		if( tabs ){
			keys = keys.concat(
				this.getActiveScreens( tabs.stack[tabs.activeIndex] )
			)
		}

		return keys;
	}

	getCurrentItem(){
		const stack = this.props.stack
		let i = stack.length
		const indexes = this.state.indexes

		while( i-- > 0 ){
			let item = stack[i];
			if( indexes[ item.key ].relative === 0 ){
				return item;
			}
		}
	}

	triggerCycleMethod( item, method ){
		if( !item ) return;

		let ref = this.screenRefs[ item.key ];
		if( ref && ref.current && ref.current[method] ){
			ref.current[method]();
		}
	}

	_onScreenReady( id ){
		this.readyScreens[ id ] = 1;
	}

	_onScreenUnmount( id ){
		delete this.readyScreens[id];
	}

	shouldComponentUpdate(){
		return !this.props.animating;
	}
}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		zIndex: 1
	},
	drawer: {},
	stack: {
		height: '100%', width: '100%'
	}
})