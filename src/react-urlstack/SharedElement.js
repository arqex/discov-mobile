import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { Context } from './utils/sharedElementContext';
import WrapperContext from './utils/wrapperContext';
import PropTypes from 'prop-types'

const isWeb = Platform.OS === 'web';

class SharedElement extends Component {
	static propTypes = {
		// These properties are used by the TransitionElement
		transition: PropTypes.oneOf([ PropTypes.object, PropTypes.func ]),
		transitionRender: PropTypes.func,
		transitionState: PropTypes.number,

		// This sharedId is used by the sharedElementContext to match what components
		// need to be shared
		sharedId: PropTypes.string,
	}

	static defaultTypes = {
	
	}
	
	constructor(props) {
		super(props);
		props.se.register( this, props );
	}

	render() {
		return (
			<View style={ this.props.style }
				ref="el"
				onLayout={ () => this._onLayout() }
				pointerEvents="auto">
				{ this.props.children }
			</View>
		);
	}
	
	componentWillUnmount(){
		this.props.se.unregister( this );
	}

	measure( offset ){
		this.box = false;

		if( !isWeb && !this.layouted ){
			// We need the layout to calculate the measures properly in native
			return setTimeout( () => this.measure( offset ) );
		}
		
		this.refs.el && this.refs.el.measure( ( cx, cy, width, height, x, y ) => {
			this.box = {
				width, height,
				x: x - offset.x,
				y: y - offset.y
			};
		})
	}

	_onLayout(){
		this.layouted = true;
	}
}

function ContextConsumerHOC( Component ){
	return function SharedElementHOC( props ){
		
		return (
			<Context.Consumer>
				{ se => (
					<WrapperContext.Consumer>
						{ wrapper => (
							<Component {...props} se={se} wrapper={wrapper} />
						)}
					</WrapperContext.Consumer>
				)}
			</Context.Consumer>
		)
	}
}

const SharedElementWithContext = ContextConsumerHOC( SharedElement )
export default SharedElementWithContext
