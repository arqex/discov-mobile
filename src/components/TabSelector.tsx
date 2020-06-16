import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, Animated, Platform, ScrollView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import styleVars from './styleVars';
import Icon from './Icon';

const colors = styleVars.colors;

export default class TabSelector extends Component {
	static propTypes = {
		items: PropTypes.array,
		minTabWidth: PropTypes.number,
		iconSize: PropTypes.number,
		/** Styles for the container when hovering */
		tabHoverStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
	}
	static defaultProps = {
		items: [],
		minTabWidth: 80,
		tabHoverStyle: {
			tabText: "color: #666",
			tabIcon: "color: #666"
		}
	}

	state: any
	currentIndex: number
	animatedBar: Animated.Value
	scroll: any

	constructor(props) {
		super(props)
		this._onLayout = this._onLayout.bind(this)

		let barWidth = Dimensions.get('window').width;
		this.state = {
			width: barWidth,
			itemWidth: barWidth / props.items.length
		}

		this.currentIndex = this.getCurrentIndex(props);
		this.animatedBar = new Animated.Value(this.getCurrentBarX(props))
	}

	render() {
		let props = this.props;

		let tabs = this.renderTabsAndIndex(props);

		let containerStyles = [
			styles.container,
			props.containerStyle,
			{ width: Math.max(this.state.width, props.minTabWidth * props.items.length) }
		]

		return (
			<ScrollView onLayout={e => this._onLayout(e.nativeEvent.layout)}
				horizontal ref={el => this.scroll = el}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				<View style={containerStyles}>
					{this.renderCurrentBar(tabs.currentIndex)}
					{tabs.items}
				</View>
			</ScrollView>
		)
	}

	renderTabsAndIndex(props) {
		let currentIndex;

		let tabs = props.items.map((item, i) => {
			let isCurrent = item.id === props.current;

			if (isCurrent) {
				currentIndex = i;
			}

			return (
				<TouchableOpacity style={[styles.tab, props.tabStyle, isCurrent && props.currentTabStyle]}
					onPress={ () => props.onTabPress(item.id) }
					key={item.icon}>
					{ this.renderIcon( props, isCurrent, item ) }
					<Text style={[styles.text, props.textStyle, isCurrent && styles.currentTextStyle]}>
						{item.label}
					</Text>
				</TouchableOpacity>
			)
		})

		return {
			items: tabs,
			currentIndex
		}
	}

	renderCurrentBar( currentIndex ) {
		if (currentIndex === undefined) return;

		let style = [
			styles.currentBar,
			this.props.currentBarStyle,
			{ minWidth: Math.max(this.props.minTabWidth, this.state.itemWidth) },
			{ transform: [{ translateX: this.animatedBar }] }
		]

		return (
			<Animated.View style={style} />		
		)
	}

	renderIcon( props, isCurrent, item ){
		let st = [
			styles.icon, 
			isCurrent && styles.currentIconStyle
		];

		if( item.icon === 'followers' || item.icon === 'following' ){
			return <Icon name={ item.icon } style={ st } />
		}

		return (
			<MaterialIcons name={item.icon}
				size={props.iconSize || 24}
				style={ st } />
		);
	}

	_onLayout(layout) {
		if (layout.width !== this.state.width) {
			this.setState({
				width: layout.width,
				itemWidth: layout.width / this.props.items.length
			})
		}
	}

	getCurrentIndex(props) {
		let { items, current } = (props || this.props);
		let i = items.length;
		while (i-- > 0) {
			if (items[i].id === current) {
				return i;
			}
		}
	}

	getCurrentBarX(props) {
		return Math.round(this.currentIndex * Math.max(props.minTabWidth, this.state.itemWidth))
	}

	componentDidUpdate(prevProps, prevState) {
		this.checkBarAnimation();
	}

	checkBarAnimation() {
		this.currentIndex = this.getCurrentIndex(this.props);

		if (this.currentIndex !== undefined) {
			Animated.timing(this.animatedBar, {
				toValue: this.getCurrentBarX(this.props),
				duration: 300,
				useNativeDriver: Platform.OS !== 'web'
			}).start()

			this.startScroll()
		}
	}

	startScroll() {
		if (!this.scroll) return;

		let containerWidth = this.state.width
		let itemWidth = Math.max(this.props.minTabWidth, this.state.itemWidth)
		let contentWidth = itemWidth * this.props.items.length;

		if (contentWidth === containerWidth) return;

		let scrollTo = Math.round((itemWidth * this.currentIndex) - (containerWidth / 2) + (itemWidth / 2))
		if (scrollTo <= 0) {
			this.scrollTo(0)
		}
		else if (scrollTo > contentWidth - containerWidth) {
			this.scrollTo(contentWidth - containerWidth)
		}
		else {
			this.scrollTo(scrollTo)
		}
	}

	scrollTo(x) {
		this.scroll.scrollTo({ x, animated: true })
	}
}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderWidth: 0,
		borderColor: '#E6EAF2',
		borderTopWidth: 1,
	},

	tab: {
		flex: 1,
		padding: 3,
		alignItems: 'center'
	},

	icon: {
		color: colors.lightText,
		alignSelf: 'center'
	},

	text: {
		color: colors.lightText,
		fontSize: 12,
		textAlign: 'center'
	},

	currentBar: {
		position: 'absolute',
		top: -1, left: 0,
		height: 2,
		backgroundColor: colors.primary
	},

	currentIconStyle: {
		color: colors.primary
	},

	currentTextStyle: {
		color: colors.primary
	}
})