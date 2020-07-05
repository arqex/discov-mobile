import React, { Component } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import {TabSelector} from '../../components';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';

class MyPeople extends Component {

	static navigationOptions = {}
	/*
	static getTransition = function(breakPoint) {
		// Not returning anything means apply the default transition for other breakPoints
		// If we want to not animate the transitions just return false
		// if (breakPoint !== 0) return;

		return {
			styles: {
				opacity: {
					inputRange: [-1, -0.3, 0, .3, 1],
					outputRange: [0, 0, 1, 0, 0]
				}
			},
			duration: 500
		}
	}
	*/

	tabStyles = {
		transform: [
			{
				translateY: this.props.indexes.transition.interpolate({
					inputRange: [-1, -0.5, 0, 0.5, 1],
					outputRange: [100, 100, 0, 100, 100]
				})
			}
		]
	}
	
	render() {
		let tabItems = [
			{ id: 'myFollowers', label: 'Followers', icon: 'followers' },
			{ id: 'following', label: 'Following', icon: 'following' },
			{ id: 'morePeople', label: 'More', icon: 'add' }
		];

		return (
			<View style={ styles.container }>
				<View style={styles.content}>
					{this.props.children}
				</View>
				<Animated.View style={[styles.tabs, this.tabStyles]}>
					<TabSelector items={tabItems}
						current={this.getSelectedTab()}
						onTabPress={id => this.props.router.navigate('/myPeople/' + id)} />
				</Animated.View>
			</View>
		)
	}

	getSelectedTab(){
		let route = this.props.router.location.pathname;
		if( route.includes('following') ){
			return 'following';
		}
		if( route.includes('morePeople') ){
			return 'morePeople';
		}
		return 'myFollowers';
	}
}

export default MyPeople;

let styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fbfcfd'
	},
	content: {
		flex: 1
	},
	tabs: {
		height: 50 + getNavigationBarHeight()
	},
	tab: {
		flex: 1,
		alignContent: 'center'
	},
	text: {
		textAlign: 'center',
		alignSelf: 'center'
	}
})