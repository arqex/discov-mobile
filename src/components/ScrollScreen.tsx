import React, { Component } from 'react'
import { StyleSheet, View, Animated, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import styleVars from './styleVars';
import interpolations from './utils/scrollInterpolation';
import { getStatusbarHeight } from './utils/getStatusbarHeight';

const headerOpenHeight = 240;
const headerClosedHeight = 58;
const headerFactor = Platform.OS === 'android' ? 8 : 15;

interface ScrollScreenProps {
	topBar?: any,
	header?: any,
	preListBar?: any,
	animatedScrollValue?: Animated.Value,
	loading?: boolean,
	data?: Array<any>,
	renderItem?: any,
	keyExtractor?: (item: any) => string,
	ListEmptyComponent?: any,
	onRefresh?: () => Promise<any>
}

export default class ScrollScreen extends Component<ScrollScreenProps> {
	deltaY = this.props.animatedScrollValue || new Animated.Value(0);

	headerTranslate: Animated.AnimatedInterpolation;
	openOpacity: Animated.AnimatedInterpolation;
	closedOpacity: Animated.AnimatedInterpolation;

	state =	 {
		refreshing: false
	}

	constructor(props) {
		super(props);

		const maxScroll = headerOpenHeight - headerClosedHeight;

		this.headerTranslate = this.deltaY.interpolate({
			inputRange: [0, maxScroll],
			outputRange: [0, maxScroll / 2],
			extrapolate: 'clamp'
		});

		this.closedOpacity = interpolations.interpolateTo1(this.deltaY)

		this.openOpacity = interpolations.interpolateTo0(this.deltaY)
	}

	scrollMapping = Animated.event([{
		nativeEvent: { contentOffset: { y: this.deltaY } },
	}], { useNativeDriver: true });

	render() {
		return (
			<View style={styles.container}>
				{this.renderTopBar()}
				{this.renderContent()}
			</View>
		)
	}

	_onScroll = e => {
		// console.log( e.nativeEvent );
	}

	renderTopBar() {
		let scrollPadding;
		if (this.props.loading) {
			scrollPadding = this.renderScrollPadding();
		}

		return (
			<View style={styles.topBar}>
				{this.props.topBar}
				{ scrollPadding }
			</View>
		);
	}

	renderContent() {
		if (this.props.loading) {
			return this.renderLoading();
		}
		if (this.props.data) {
			return this.renderFlatList();
		}
		return this.renderScrollView();
	}

	renderLoading() {
		return (
			<View style={styles.loading}>
				<ActivityIndicator color={styleVars.colors.secondary}
					animating />
			</View>
		);
	}

	renderFlatList() {
		return (
			<Animated.FlatList
				onScroll={this.scrollMapping}
				snapToOffsets={[headerOpenHeight - headerClosedHeight]}
				snapToEnd={false}
				decelerationRate="fast"
				nestedScrollEnabled={true}
				scrollEventThrottle={1}
				ListHeaderComponent={this.renderScrollPadding()}
				ListEmptyComponent={this.props.ListEmptyComponent}
				data={this.props.data}
				renderItem={this.props.renderItem}
				keyExtractor={this.props.keyExtractor}
				refreshControl={ this.getRefresh() }
				// contentContainerStyle={{ width: '100%' }}
			/>
		);
	}

	renderScrollView() {
		return (
			<Animated.ScrollView
				onScroll={this.scrollMapping}
				snapToOffsets={[headerOpenHeight - headerClosedHeight]}
				snapToEnd={false}
				decelerationRate="fast"
				nestedScrollEnabled={true}
				refreshControl={this.getRefresh()}
				scrollEventThrottle={1}>
				{this.renderScrollPadding()}
				{this.props.children}
			</Animated.ScrollView>
		)
	}

	renderScrollPadding() {
		let headerStyles = [styles.header, {
			paddingTop: getStatusbarHeight() + (headerClosedHeight / headerFactor * 3),
			opacity: this.openOpacity,
			transform: [{ translateY: this.headerTranslate }]
		}];

		let preListBarStyles = [styles.preListBar, {
			opacity: this.openOpacity
		}];

		return (
			<View style={styles.padding}>
				<Animated.View style={headerStyles}>
					{this.props.header}
				</Animated.View>
				<Animated.View style={preListBarStyles}>
					{this.props.preListBar}
				</Animated.View>
			</View>
		);
	}

	getRefresh(){
		if( !this.props.onRefresh ) return;

		return (
			<RefreshControl
				refreshing={ this.state.refreshing }
				onRefresh={ this._onRefresh } />
		);
	}

	_onRefresh = () => {
		console.log('Refreshing start');
		this.setState({refreshing: true});
		this.props.onRefresh()
			.finally( () => {
				console.log('Refreshing end');
				this.setState({ refreshing: false });
			})
		;	
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 80
	},

	topBar: {
		position: 'absolute',
		top: 0, left: 0, right: 0,
		zIndex: 2
	},

	header: {
		flex: 1, flexGrow: 1, position: 'absolute',
		top: 0, left: 0, right: 0,
		zIndex: 2,
		height: headerOpenHeight,
		alignItems: 'center',
		justifyContent: 'center'
	},

	preListBar: {
		position: 'absolute',
		bottom: 0, left: 0, right: 0,
		zIndex: 2
	},

	padding: {
		height: headerOpenHeight,
		justifyContent: "flex-end",
		position: 'relative'
	},

	loading: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})