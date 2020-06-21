import * as React from 'react';
import {StyleSheet, View, Dimensions, Platform} from 'react-native';
import MapView, { Circle, AnimatedRegion, MapViewProps, Marker } from 'react-native-maps';
import { storyService } from '../../services/story.service';
import { DiscovMarker } from '../../components';
import { lngToLocation } from '../../utils/maps';
import StoryCircle from './StoryCircle';

let windowWidth = Dimensions.get('window').width;

const nofn = () => {};
interface StoryMapProps extends MapViewProps {
	showMarker?: boolean,
	showCircle?: boolean,
	storyLocation: any,
	discoveryRadius?: number,
	currentPosition?: any,
	trackCurrentPosition?: boolean,
	focusedPlace?: any,
	places?: any,
	dragMode?: boolean,
	showDragMode?: boolean,
	onPressPlace?: (any) => void
	onPressCurrentLocation?: () => void
}

interface StoryMapState {

}

export default class StoryMap extends React.Component<StoryMapProps, StoryMapState> {

	animatedRegion: AnimatedRegion
	currentRegion: any

	state = {
		loading: true,
		trackCurrentPosition: true,
		region: this.getRegion( this.props ),
		moving: false,
		dragMode: false
	}

	constructor( props ) {
		super( props );

		this.currentRegion = this.state.region;
	}

	render() {
		if( this.state.loading ){
			return this.renderLoadingLayer();
		}

		const { 
			storyLocation, showMarker, showCircle, children, 
			region, discoveryRadius, dragMode, currentPosition,
			 ...mapProps
		} = this.props;

		console.log('map props', mapProps)

		return (
			<View style={{ display: 'flex', flexGrow: 1, width: windowWidth }}>
				<MapView 
					style={{ display: 'flex', flexGrow: 1, width: windowWidth }}
					provider="google"
					onMapReady={ this._onMapReady }
					{...mapProps}
					ref="map"
					initialRegion={ this.currentRegion }
					onPress={ this._onPress }
					onRegionChange={ this._onRegionChange }
					onRegionChangeComplete={ this._onRegionChangeComplete }>
					{ renderMarker(storyLocation.location, showMarker && !dragMode) }
					{ renderCircle(storyLocation.location, discoveryRadius, showCircle) }
					{ this.renderCurrentPosition() }
					{ this.renderPlaces() }
					{children}
				</MapView>
				{ this.renderDragMarker() }
			</View>
		);
	}

	renderLoadingLayer(){
		return <View style={ styles.loadingLayer} onLayout={ this._onLoadEnd }></View>;
	}

	renderCurrentPosition() {
		let storyLocation = this.props.storyLocation;
		let isSelected = storyLocation && storyLocation.place && storyLocation.place.type === 'address';
		if( isSelected && this.props.showMarker ) {
			// Location marker is already shown
			return;
		} 
		
		if( this.props.currentPosition ){
			return renderPlaceMarker(
				this.props.currentPosition,
				'current',
				{sourceId: 'current'},
				this._onPressCurrentLocation,
				isSelected
			);
		}
	}

	renderPlaces() {
		let places = this.props.places;
		if (!places) return;

		return places.map( p => {
			let isSelected = p.sourceId === (this.props.storyLocation.place || {}).sourceId;
			if( isSelected && this.props.showMarker ) {
				// Location marker is already shown
				return;
			} 

			return renderPlaceMarker(
				{ longitude: p.location.lng, latitude: p.location.lat }, 
				'place',
				p,
				this._onPressPlace,
				isSelected
			);
		});
	}

	renderDragMarker(){
		if( !this.props.dragMode ) return;

		return (
			<View style={ styles.dragMarker }>
				<DiscovMarker
					location={this.props.storyLocation.location}
					elevated={ this.state.moving } />
			</View>
		);
	}

	componentDidUpdate( prevProps ){
		let propRegion = this.props.region;
		if( propRegion && prevProps.region !== propRegion && this.currentRegion !== this.props.region ){
			return this.moveToRegion( propRegion );
		}
		
		if ( this.props.trackCurrentPosition && prevProps.currentPosition !== this.props.currentPosition){
			console.log('Moving, trackin position');
			return this.moveToRegion({
				latitude: this.props.currentPosition.latitude,
				longitude: this.props.currentPosition.longitude
			});
		}
	}

	sameRegions( r1, r2 ){
		return r1 && r2 &&
			Math.abs( r1.latitude - r2.latitude ) < 0.000001 &&
			Math.abs( r1.longitude - r2.longitude ) < 0.000001 &&
			Math.abs( r1.latitudeDelta - r2.latitudeDelta ) < 0.000001 &&
			Math.abs( r1.longitudeDelta - r2.longitudeDelta ) < 0.000001
		;
	}

	getRegion( props ){
		let { region, storyLocation, currentPosition } = props;
		let r = region || storyService.getDefaultRegion(storyLocation, currentPosition);
		return r;
	}

	_onPress = param => {
		if( this.props.onPress ){
			return this.props.onPress( param );
		}
	}

	_onRegionChange = region => {
		if( !this.state.moving ){
			this.setState({moving: true});
		}
		if (this.props.onRegionChange) {
			this.props.onRegionChange(region);
		}
	}

	_onRegionChangeComplete = region => {
		this.currentRegion = region;

		if (this.props.onRegionChangeComplete) {
			this.props.onRegionChangeComplete(region);
		}

		this.setState({moving: false});
	}

	_onMapReady = () => {
		this.setState({
			trackCurrentPosition: this.props.trackCurrentPosition
		});
	}

	_onLoadEnd = () => {
		console.log( 'Load map end');
		if( !this.sameRegions( this.currentRegion && this.state.region, this.currentRegion ) ){
			this.moveToRegion( this.currentRegion );
		};
		this.setState({loading: false})
	}

	moveToRegion( region ) {
		let r = {
			...this.currentRegion,
			...region
		};

		console.log('Moving to region!');

		this.currentRegion = r;
		this.refs.map && this.refs.map.animateToRegion( r );
	}

	_onPressPlace = place => {
		this.props.onPressPlace && this.props.onPressPlace( place )
	}
	_onPressCurrentLocation = () => {
		this.props.onPressCurrentLocation && this.props.onPressCurrentLocation();
	}
}

function renderMarker( location, show ){
	if( !show || !location ) return null;
	return <DiscovMarker location={ location } />;
}

function renderCircle( loc, radius, show ){
	if( !show || !radius ) return null;

	let location = lngToLocation( loc );

	return (
		<StoryCircle center={ location }
			radius={ radius } />
	);
}

function renderPlaceMarker(location, type, place, onPress, isFocused) {
	let markerStyles = [
		isFocused && styles.markerFocused
	];

	let st = [
		styles.placeMarker,
		styles[`placeMarker_${type}`],
		isFocused && styles.focusedMarker
	];

	return (
		<Marker coordinate={location}
			style={ markerStyles }
			onPress={ onPress && (() => onPress(place)) }
			key={place.sourceId}>
				<View style={styles.placeMarkerWrapper}>
			     <View style={st} />
				</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	markerFocused: {
		zIndex: 2
	},

  placeMarkerWrapper: {
		width: 20, height: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	placeMarker: {
		width: 16, height: 16,
		borderWidth: 2,
		borderColor: '#fff',
		borderRadius: 8,
		backgroundColor: '#999'
	},
	placeMarker_current: {
		backgroundColor: '#09f',
		zIndex: 3
	},
	placeMarker_place: {
		backgroundColor: '#0f9',
		zIndex: 1
	},
	focusedMarker:{
		transform: [{scale: 1.3}],
		overflow: 'visible',
		borderColor: '#cfe'
	},
	loadingLayer: {
		flex: 1,
		backgroundColor: '#ddd'
	},

	dragMarker: {
		width: 4, height: 4,
		position: 'absolute',
		left: '50%', top: '50%',
		transform: [
			{translateX: Platform.OS === 'ios' ? 0 : -15},
			{translateY: Platform.OS === 'ios' ? 3 : -57},
		]
	}
});