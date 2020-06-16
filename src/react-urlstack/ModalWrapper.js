import React, {Component, createRef} from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import {animatedStyles} from './utils/animatedStyles'
import ScreenContent from './ScreenContent'

export default class ModalWrapper extends Component {
	constructor(props){
		super(props)
		this.screenRef = createRef()
		this.setAnimatedLayout( props.indexes, props.layout )
	}

	render(){
		let containerStyles = [
			styles.container,
			this.animatedStyles
		]

		let item = this.props.stack[0];
		let content;
		
		if( item ){
			content = <ScreenContent renderScreen={ this._renderScreen } animating={ this.props.animating } />;
		}

		return (
			<Animated.View style={ containerStyles }>
				{ content }
			</Animated.View>
		)
	}

	_renderScreen = () => {
		let item = this.props.stack[0];
		let ref = item.Screen.prototype instanceof Component ? this.screenRef : undefined;

		return (	
			<item.Screen router={ this.props.router }
				ref={ ref }
				drawer={ this.props.drawer }
				indexes={ this.props.indexes }
				layout={ this.props.layout }
				location={ item.location }
				breakPoint={ this.props.breakPoint }
				{...this.props.navProps } />
		);
	}

	getScreenItem( item ){
		if( item && item !== this.item ){
			this.item = item;
		}
		return this.item;
	}
	
	setAnimatedLayout( indexes, layout ){
		this.animatedStyles = animatedStyles( this.props.transition, indexes, layout )
	}

	hasLayoutChanged(prevProps) {
		if (!this.props.indexes) return;

		let { width } = prevProps.layout;
		let { showing } = prevProps.indexes;
		let { layout, indexes } = this.props;

		return (
			width !== layout.width ||
			showing !== indexes.showing
		);
	}
	
	componentWillUnmount(){
		if( this.props.indexes.showing ){
			this.triggerCycleMethod('componentWillLeave')
		}
	}

	componentDidMount(){
		if( this.props.indexes.showing ){
			this.triggerCycleMethod('componentWillEnter')
		}
	}

	componentDidUpdate( prevProps ){
		const prevShowing = prevProps.indexes.showing;
		const nextShowing = this.props.indexes.showing;

		if( prevShowing && !nextShowing ){
			this.triggerCycleMethod('componentWillLeave')
		}
		else if( !prevShowing && nextShowing ){
			this.triggerCycleMethod('componentWillEnter')
		}

		if (this.hasLayoutChanged(prevProps)) {
			this.setAnimatedLayout(this.props.indexes, this.props.layout);
		}
	}

	triggerCycleMethod( method ){
		let ref = this.screenRef;
		if( ref && ref.current && ref.current[method] && this.lastLFMethod !== method){
			ref.current[method]();
		}
		this.lastLFMethod = method;
	}
}

let styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		position: 'absolute',
		width: '100%', height: '100%',
		top: 0, left: 0,
		zIndex:10,
		shadowColor: '#000',
		shadowOpacity: .1,
		shadowRadius: 10,
		elevation: 3
	}
})