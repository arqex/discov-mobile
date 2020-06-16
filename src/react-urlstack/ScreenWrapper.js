import React, {Component, createRef} from 'react'
import { StyleSheet, Animated } from 'react-native'
import tabTransition from './defaultTransitions/tabTransition'
import {animatedStyles} from './utils/animatedStyles'
import Context from './utils/wrapperContext'
import {createId, nofn} from './utils/utils'
import ScreenContent from './ScreenContent'

export default class ScreenWrapper extends Component {
	constructor(props){
		super(props)

		this.id = createId()

		this.screenRef = createRef()

		this.setAnimatedLayout( props.indexes, props.layout )
	}

	static defaultProps ={
		onReady: nofn,
		onUnmount: nofn
	}

	render(){
		let item = this.props.item
		let containerStyles = [
			styles.container,
			this.animatedStyles
		]
		let contextValue = {
			transition: this.props.transition,
			indexes: this.props.indexes,
			id: item.key
		}

		return (
			<Animated.View style={ containerStyles } onLayout={ () => this.props.onReady( item.key ) }>
				<Context.Provider value={contextValue}>
					<ScreenContent renderScreen={ this._renderScreen } animating={ this.props.animating } />
				</Context.Provider>
			</Animated.View>
		)
	}

	_renderScreen = () => {
		let { item, ScreenStack, router, transition, indexes, layout, drawer, breakPoint, navProps } = this.props;
		let { Screen, location } = item;
		let ref = Screen.prototype instanceof Component ? this.screenRef : undefined;

		if( item.isTabs ){
			return (
				<Screen router={router}
					ref={ ref }
					location={location}
					indexes={indexes}
					layout={layout}
					drawer= { drawer }
					breakPoint={ breakPoint }
					{ ...navProps } >
					<ScreenStack router={ router }
						isTabs={ true }
						screenTransition={ transition.tabTransition || tabTransition }
						stack={ item.tabs.stack }
						index={ item.tabs.activeIndex }
						parentIndexes={ indexes }
						layout={ layout }
						breakPoint={breakPoint}
						drawer={drawer}
						navProps={ navProps } />
				</Screen>
			)
		}

		return (
			<Screen router={router}
				ref={ ref }
				location={location}
				indexes={indexes}
				layout={layout}
				drawer= { drawer }
				breakPoint={ breakPoint }
				{...navProps} />
		)
	}
	
	setAnimatedLayout( indexes, layout ){
		let transition = this.props.transition;
		this.animatedStyles = transition ? animatedStyles( transition, indexes, layout ) : {};
	}

	componentDidUpdate(prevProps) {
		if (this.hasLayoutChanged(prevProps)) {
			this.setAnimatedLayout(this.props.indexes, this.props.layout);
		}
	}

	hasLayoutChanged(prevProps) {
		if (!this.props.indexes) return;

		let { width } = prevProps.layout;
		let { screen, relative } = prevProps.indexes;
		let { layout, indexes } = this.props;

		return (
			width !== layout.width ||
			screen !== indexes.screen ||
			relative !== indexes.relative ||
			this.props.transition !== prevProps.transition
		);
	}

	componentWillUnmount(){
		if( this.props.isShowing && this.props.indexes.relative === 0 ){
			this.triggerCycleMethod('componentWillLeave')
		}
		this.props.onUnmount( this.props.item.key )
	}

	componentDidMount(){
		if( this.props.isShowing && this.props.indexes.relative === 0 ){
			this.triggerCycleMethod('componentWillEnter')
		}
	}

	componentWillEnter(){
		this.triggerCycleMethod('componentWillEnter')
	}

	componentWillLeave(){
		this.triggerCycleMethod('componentWillLeave')
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
		top: 0, left: 0, bottom: 0, right: 0,
		zIndex:10
	}
})