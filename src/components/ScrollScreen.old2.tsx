import React, { Component } from 'react'
import { StyleSheet, View, Animated, ActivityIndicator } from 'react-native'
import TopBar from './TopBar';
import { getStatusbarHeight } from './utils/getStatusbarHeight';
import styleVars from './styleVars';

const headerOpenHeight = 240;
const headerClosedHeight = 58;

interface ScrollScreenProps {
	preButtons?: any,
	postButtons?: any,
	closedHeader?: any,
	openHeader?: any,
	loading?: boolean,
	data?: Array<any>,
	renderItem?: any,
	keyExtractor?: (item:any) => string,
	ListEmptyComponent?: any
}

export default class ScrollScreen extends Component<ScrollScreenProps> {
	deltaY = new Animated.Value(0);

	headerTranslate: Animated.AnimatedInterpolation;
	paddingScale: Animated.AnimatedInterpolation;
	openOpacity: Animated.AnimatedInterpolation;
	closedOpacity: Animated.AnimatedInterpolation;
	
	constructor( props ) {
		super(props);

		const maxScroll = headerOpenHeight - headerClosedHeight;

		this.headerTranslate = this.deltaY.interpolate({
			inputRange: [0, maxScroll],
			outputRange: [0, -maxScroll],
			extrapolate: 'clamp'
		}); 
		
		this.paddingScale = this.deltaY.interpolate({
			inputRange: [0, maxScroll],
			outputRange: [headerOpenHeight, headerClosedHeight],
			extrapolate: 'clamp'
		});

		this.closedOpacity = this.deltaY.interpolate({
			inputRange: [0, maxScroll/2, maxScroll],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp'
		})

		this.openOpacity = this.deltaY.interpolate({
			inputRange: [0, maxScroll / 4, maxScroll / 5 * 3, maxScroll],
			outputRange: [1, 1, 0, 0],
			extrapolate: 'clamp'
		})
	}

	scrollMapping = Animated.event([{
		nativeEvent: {contentOffset: {y: this.deltaY}},
	}], {useNativeDriver: true});

	render() {
		let statusBarHeight = getStatusbarHeight();

		let headerStyles = [
			styles.header,
			{	paddingTop: statusBarHeight + (headerClosedHeight / 3) },
			{ transform: [{ translateY: this.headerTranslate }], opacity: this.openOpacity }
		];

		let headerBarHeight = {
			height: headerClosedHeight + statusBarHeight,
			paddingTop: statusBarHeight
		};

		let headerBackgroundStyles = [
			{ position: 'absolute', top: 0, left: 0, right: 0, height: headerClosedHeight, zIndex: 3},
			{ opacity: this.closedOpacity }
		];
		let headerClosedContentStyles = [
			{ flex: 1, flexGrow: 1 },
			{ opacity: this.closedOpacity }
		];

		return (
			<View style={styles.container}>
				<Animated.View style={ headerBackgroundStyles }>
					<TopBar withSafeArea dropShadow />
				</Animated.View>
				<View style={[styles.headerBar, headerBarHeight] }>
					<View style={ styles.headerBarPre }>
						{ this.props.preButtons }
					</View>
					<Animated.View style={ headerClosedContentStyles }>
						{ this.props.closedHeader }
					</Animated.View>
					<View style={styles.headerBarPost}>
						{this.props.postButtons}
					</View>
				</View>
				<Animated.View style={ headerStyles }>
					{ this.props.openHeader }
				</Animated.View>
				{ this.renderContent() }
			</View>
		)
	}
	_onScroll = e => {
		// console.log( e.nativeEvent );
	}

	renderContent(){
		if( this.props.loading ){
			return this.renderLoading();
		}
		if( this.props.data ){
			return this.renderFlatList();
		}
		return this.renderScrollView();
	}

	renderLoading() {
		return (
			<View style={ styles.loading }>
				<ActivityIndicator color={styleVars.colors.secondary}
					animating />
			</View>
		);
	}

	renderFlatList(){
		let padding = <Animated.View style={ styles.padding } />;
		return (
			<Animated.FlatList
				onScroll={ this.scrollMapping }
				snapToOffsets={[headerOpenHeight - headerClosedHeight] }
				snapToEnd={ false }
				decelerationRate="fast"
				scrollEventThrottle={1}
				ListHeaderComponent={ padding }
				ListEmptyComponent={ this.props.ListEmptyComponent }
				data={ this.props.data }
				renderItem={ this.props.renderItem }
				keyExtractor={ this.props.keyExtractor }
				contentContainerStyle={{width: '100%'}}
			/>
		);
	}

	renderScrollView() {
		return (
			<Animated.ScrollView
				onScroll={ this.scrollMapping }
				snapToOffsets={[headerOpenHeight - headerClosedHeight] }
				snapToEnd={ false }
				decelerationRate="fast"
				scrollEventThrottle={1}>
				<Animated.View style={ styles.padding } />
				{ this.props.children }
			</Animated.ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 80
	},
	header: {
		position: 'absolute',
		height: headerOpenHeight,
		top: 0, left: 0, right: 0,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2
	},
	headerBar: {
		position: 'absolute',
		zIndex: 4,
		top: 0, left: 0, right: 0,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerBarPre: {
		flexDirection: 'row',
		marginLeft: 5
	},
	headerBarPost: {
		flexDirection: 'row',
		marginRight: 5
	},
	padding: {
		height: headerOpenHeight
	},
	list: {

	},
	loading: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})