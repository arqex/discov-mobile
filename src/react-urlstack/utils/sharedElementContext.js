import React, {Component} from 'react'
import TransitionElement from '../TransitionElement'
import {View, StyleSheet} from 'react-native'
import {createId} from './utils'

const Context = React.createContext('sharedElement');

// We will be storing the mounted elements by routes
let mountedElements = {}

// When a shared element is mounted it calls to this function
// and we register it
function register(instance, props ) {
	let wrapper = props.wrapper.id
	if (!mountedElements[wrapper]) {
		mountedElements[wrapper] = []
	}
	mountedElements[wrapper].push(instance);
}

// When it's unmounted we delete the references to it
function unregister(instance) {
	let wrapper = instance.props.wrapper.id
	let stack = mountedElements[ wrapper ]
	if( !stack ) return;
	
	if (stack) {
		let i = stack.length
		while (i-- > 0) {
			if (stack[i] === instance) {
				stack.splice(i, 1); 
			}
		}
	}
}

// Layers registered callback to listen to transitions
let clbks = []

// Here we will be store the current breakPoint and screenIndexes when
// the shared elements are measured
let breakPoint, screenIndexes;

// Needs to force all the shared element to measure themselves in order to get
// the rights coords to start the shared element transitions
// This is called by the ScreenStack when the transition has just been required
function reMeasure( layout, bp, indexes ){
	let screens = Object.keys( mountedElements );
	if( screens.length < 2 ) return;

	breakPoint = bp
	screenIndexes = indexes

	let offset = { x: layout.x, y: layout.y };
	screens.forEach( key => {
		mountedElements[key].forEach( el => {
			el.measure( offset );
		})
	})
}

// This method is called just before starting the screen transition when the URL changes
// Screen stack is the one responsible of calling it through the context
function startTransition( leavingKeys, enteringKeys, toIndex, leavingTransition ){
	clbks.forEach( clbk => clbk( leavingKeys, enteringKeys, toIndex, leavingTransition ) )
}

class TransitionLayer extends Component {
	constructor( props ){
		super( props )
		this.state = {
			elements: []
		}
		this.checkForTransitions = this.checkForTransitions.bind(this);
	}

	render(){
		let layout = this.props.layout;
		let box = {
			top: layout.y || 0,
			right: (layout.x || 0) + layout.width,
			left: layout.x || 0,
			bottom: (layout.y || 0) + layout.height
		}

		let elements = this.state.elements;
		let list = Object.keys( elements ).map( id => elements[id] );
		
		return (
			<View style={ [styles.container, box] } pointerEvents="none">
				{ list }
			</View>
		)
	}

	checkForTransitions(enteringKeys, leavingKeys, toIndex, leavingTransition) {
		let couples = this.getTransitionCouples( enteringKeys, leavingKeys )

		if (!couples.length) return;

		this.leavingTransition = leavingTransition;

		this.waitForReadyAndRender( couples, toIndex );
	}

	waitForReadyAndRender( couples, toIndex ){
		// Check if the boxes are already calculated
		let i = couples.length;
		while( i-- > 0 ){
			if( !couples[i].leaving.box || !couples[i].entering.box ){
				// oops! retry
				return setTimeout( () => this.waitForReadyAndRender( couples, toIndex ) );
			}
		}
		
		let elements = {}
		couples.forEach( couple => {
			let id = createId()
			// console.log( `from ${JSON.stringify(couple.leaving.box)} to ${JSON.stringify(couple.entering.box)}` )
			elements[ id ] = this.renderElement( couple, id )
		});

		this.setState({elements})
	}

	renderElement( {leaving, entering}, id ){
		return (
			<TransitionElement key={ id }
				leaving={ leaving }
				entering={ entering }
				breakPoint={ breakPoint }
				screenIndexes={ screenIndexes }
				leavingTransition={ this.leavingTransition && this.leavingTransition( breakPoint ) }
				onTransitionEnd={ () => this.removeElement(id) } />
		)
	}

	removeElement( id ){
		let elements = { ...this.state.elements }
		delete elements[id]
		this.setState({elements})
	}

	cleanProps( props ){
		let clean = {};

		Object.keys( props ).forEach( p => {
			if( p !== 'se' && p !== 'wrapper' && p !== 'children' && p !== 'transitionStyles' ) {
				clean[ p ] = props[p]
			}
		});

		return clean;
	}
	
	getTransitionCouples( fromIds, toIds ){
		let leaving = {};
		let couples = [];

		fromIds.forEach( id => {
			mountedElements[id] && mountedElements[id].forEach( el => {
				leaving[ el.props.sharedId ] = el;
			})
		})

		toIds.forEach( id => {
			mountedElements[id] && mountedElements[id].forEach( el => {
				if ( leaving[el.props.sharedId] ){
					couples.push({
						leaving: leaving[ el.props.sharedId ],
						entering: el
					})
				}
			})
		})

		return couples;
	}

	componentDidMount(){
		// Start listening to transitions
		clbks.push( this.checkForTransitions );
	}

	componentWillUnmount(){
		let i = clbks.length;
		while( i-- > 0 ){
			if( clbks[i] === this.checkForTransitions ){
				// Remove the callback
				clbks.splice( i , 1 );
			}
		}
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 10000
	}
})

const SharedElementWrapper = props => (
	<Context.Provider value={{ register, unregister, startTransition, reMeasure }}>
		{ props.children }
		<TransitionLayer router={ props.router } layout={ props.layout } />
	</Context.Provider>
);

export {
	Context,
	SharedElementWrapper
}