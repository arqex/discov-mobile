import * as React from 'react'
import { StyleSheet, View, Animated, Platform } from 'react-native';
import layoutUtils from './utils/layout.utils';
import { getStatusbarHeight } from './utils/getStatusbarHeight';

interface MapScreenProps {
	top?: any,
	map?: any,
	layout: any,
	initialMode?: 'smallMap' | 'bigMap',
	allowBigMap?: boolean,
	allowScroll?: boolean,
	mapTop?: any,
	mapBottom?: any,
	overlay?: any
}

export default class MapScreen extends React.Component<MapScreenProps> {
	deltaY = new Animated.Value(0);

	paddingTranslate: Animated.AnimatedInterpolation;

	static defaultProps = {
		allowScroll: true,
		allowBigMap: true
	}
	
	constructor( props ) {
		super(props);

		let heights = this.getHeights();

		this.deltaY.setValue( this.getInitialDelta(props, heights) );
		
		this.paddingTranslate = this.deltaY.interpolate({
			inputRange: [0, heights.bigMap],
			outputRange: [0, heights.bigMap / 2],
			extrapolate: 'clamp'
		});
	}

	scrollMapping = Animated.event(
		[
			{ nativeEvent: {contentOffset: {y: this.deltaY}} }
		], {useNativeDriver: true}
	);

	render() {
		let heights = this.getHeights();

		let paddingStyles = [
			styles.padding,
			{ 
				height: heights.bigMap,
				transform: [{translateY: this.paddingTranslate}]
			}
		]

		let contentStyles = [
			styles.childrenWrapper,
			!this.props.allowScroll && styles.noScrollable,
			!this.props.allowScroll && { height: heights.minPanel }
		];

		return (
			<View style={styles.container}>
				{this.renderTopBar()}
				{this.renderMapTopControls()}
				{this.renderOverlay()}
				<Animated.ScrollView
					ref="scroll"
					bounces={ false }
					contentOffset={ {x: 0, y: heights.initialScroll } }
					onScroll={ this.scrollMapping }
					snapToOffsets={[heights.minPanel]}
					nestedScrollEnabled={ true }
					snapToEnd={false}
					decelerationRate="fast"
					scrollEnabled={ this.props.allowScroll || this.props.allowBigMap }
					scrollEventThrottle={1}>
					<Animated.View style={ paddingStyles }>
						<Animated.View style={{ flex:1, height: heights.bigMap + 10, alignItems: 'stretch' }}>
							{ this.props.map }
						</Animated.View>
					</Animated.View>
					<View style={contentStyles}>
						{ this.renderHandle() }
						{ this.renderMapBottomControls() }
						{this.props.children}
					</View>
				</Animated.ScrollView>
			</View>
		)
	}

	renderTopBar() {
		if( !this.props.top ) return;

		return (
			<View style={{ zIndex: 10 }}>
				{ this.props.top }
			</View>
		)
	}

	renderMapTopControls() {
		if( !this.props.mapTop ) return;

		let st = [
			styles.mapTop,
			!this.props.top && { top: getStatusbarHeight() + 8 }
		];

		return (
			<View style={ st }>
				{ this.props.mapTop }
			</View>
		)
	}

	renderOverlay() {
		if( !this.props.overlay ) return;

		let heights = this.getHeights();
		let olStyle = [
			styles.searchPanelWrapper,
			{ top: this.props.top ? heights.topBar + heights.statusBar : 0 } 
		];

		return (
			<View style={ olStyle }>
				{ this.props.overlay }
			</View>
		);

	}

	renderHandle() {
		if( !this.props.allowBigMap && !this.props.allowScroll ) return;

		return (
			<View style={ styles.handleWrapper }>
				<View style={ styles.handle } />
			</View>
		);
	}

	renderMapBottomControls() {
		return (
			<View style={styles.mapBottom}>
				{ this.props.mapBottom }
			</View>
		);
	}

	getInitialDelta( props, heights ){
		let initialDelta = heights.bigMap - heights.header;
		if( props.top ){
			initialDelta += heights.topBar;
		}

		return initialDelta;
	}

	getHeights() {
		let heights: any = layoutUtils.getHeights()[
			this.props.top ? 'withTopBar' : 'withoutTopBar'
		];

		heights.initialScroll = heights.window - heights.header - heights.statusBar;

		console.log('HHHHEIGHTS', heights );

		return heights;
	}
	
	componentDidMount() {
		let scroll = this.refs.scroll;
		if( scroll && Platform.OS !== 'ios' ){
			setTimeout( () => {
				scroll._component.scrollTo({
					x: 0,
					y: this.getHeights().minPanel,
					animated: false
				});
			});
		}
	}

	closeMap() {
		let scroll = this.refs.scroll;
		return scroll && scroll._component.scrollTo({
			x: 0,
			y: this.getHeights().minPanel,
			animated: true
		});
	}

	openMap() {
		let scroll = this.refs.scroll;
		return scroll && scroll._component.scrollTo({
			x: 0,
			y: 0,
			animated: true
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	padding: {
		display: 'flex',
		alignItems: 'stretch',
		justifyContent: 'center'
	},
	
	list: {

	},

	mapTop: {
		position: 'absolute',
		left: 0, top: 8,
		zIndex: 20
	},

	handleWrapper: {
		position: 'absolute',
		top: -25, left: 0, right: 0,
		display: 'flex',
		alignItems: 'center'
	},

	handle: {
		backgroundColor: 'rgba(0,0,0,.2)',
		height: 8, width: 60,
		alignSelf: 'center',
		borderRadius: 4
	},

	noScrollable: {
	},

	childrenWrapper: {
	},

	mapBottom: {
		position: 'absolute',
		top: -70, right: 20,
		height: 46,
		zIndex: 40
	},

	searchPanelWrapper: {
		position: 'absolute',
		left: 0, right: 0, bottom: 0,
		zIndex: 10
	}
})