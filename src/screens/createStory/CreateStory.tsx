import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { TopBar, Button, MapScreen, Text, Modal, SearchBar } from '../../components';
import MapPanel from './MapPanel';
import AreaSelector from './AreaSelector';
import LocationSelector from './LocationSelector';
import storeService from '../../state/store.service';
import PositionProvider from '../../providers/PositionProvider';
import { lngToLocation, locationToLng } from '../../utils/maps';
import StoryMap from '../components/StoryMap';
import NoLocationScreen from '../components/NoLocationScreen';
import EditLocationModal from './EditLocationModal';
import SearchPlacePanel from './SearchPlacePanel';
import locationManager from '../../location/location.manager';
import BackButtonHandler from '../../utils/BackButtonHandler';
import BgLocation from '../../location/BgLocation';

// Stores the temporal data in store.storyInProgress

interface CreateStoryState {
	storyLocation: any,
	locationSelected: boolean,
	regionInView: any,
	discoveryRadius: number,
	userAddress: false | String,
	places: false | [any],
	dragActive: boolean,
	customLocation: string,
	searchingPlace: boolean,
	searchQuery: string,
	showingSearchOverlay: boolean
}

interface CreateStoryProps extends ScreenProps {
	position: any
}

class CreateStory extends Component<CreateStoryProps, CreateStoryState> {
	map = React.createRef()
	circle = React.createRef()

	constructor( props ){
		super(props);

		// refresh permissions
		locationManager.getPermissions();

		let story = this.getStory();
		let location = story.location && lngToLocation(story.location) || this.props.position;

		let storyLocation = location && {
			location: locationToLng(location),
			place: story.place || this.getUserPlace( location )
		};

		this.state = {
			locationSelected: false,
			storyLocation,
			regionInView: story.region || this.getRegion(location),
			discoveryRadius: story.discoveryRadius || 100,
			places: this.loadPlaces( this.props.position ),
			userAddress: this.loadAddress( this.props.position ),
			dragActive: false,
			customLocation: '',
			searchingPlace: false,
			searchQuery: '',
			showingSearchOverlay: false
		}
	}	
	
	componentDidMount() {
		BackButtonHandler.addListener( this._onBackPress );
		this.preloadFollowers();
		BgLocation.startTracking();
	}

	componentDidUpdate( prevProps, prevState ) {
		if( !prevProps.position && this.props.position ){
			let position = this.props.position;
			if( !this.state.storyLocation ){
				this.loadPlaces( position )
				this.loadAddress( position );
				
				this.setState({
					regionInView: this.getRegion( position )
				})
			}
		}
		if( prevState.locationSelected !== this.state.locationSelected ){
			this._closeMap();
		}
	}

	render() {
		if( !this.hasLocationPermission() ){
			return this.renderLocationNotGranted();
		}

		return (
			<MapScreen top={ this.renderTopBar() }
				map={ this.renderMap() }
				layout={ this.props.layout }
				mapBottom={ this.renderMapControls() }
				ref="mapScreen"
				allowScroll={ false }
				overlay={	this.renderSearchPanel() }>
				<MapPanel style={styles.panel}>
					{ this.renderContent() }
				</MapPanel>
			</MapScreen>
		)
	}

	renderContent() {
		if( this.state.locationSelected ){
			return (
				<AreaSelector
					value={ this.state.discoveryRadius }
					accountId={ storeService.getUserId() }
					story={ this.state.storyLocation }
					onChange={ this._onChangeArea }
					onSelect={ this._onSelectArea } />
			);
		}

		return (
			<LocationSelector
				userLocation={ locationToLng(this.props.position) }
				storyLocation={ this.state.storyLocation }
				dragMode={ this.state.dragActive }
				onSelect={ this._onSelectLocation }
				places={ this.state.places }
				onEditLocationName={ this._openEditLocation }
			/>
		);
	}

	renderTopBar() {
		if( this.state.locationSelected ){
			return (
				<TopBar onBack={ () => this.setState({locationSelected: false}) }
					title={ __('createStory.areaTitle') } 
					withSafeArea
				/>
			);
		}

		let backButton = (
			<Button type="icon" icon="arrow-back" color="secondary"
				onPress={() => this.props.drawer.open()} />
		);

		let searchbar = (
			<View style={styles.searchBar}>
				<SearchBar onOpen={this._startSearch}
					onClose={this._endSearch}
					onQueryChange={this._onUpdateSearchQuery}
					preButtons={backButton}>
					<Text type="mainTitle">{__('createStory.locateTitle')}</Text>
				</SearchBar>
			</View>
		);

		return (
			<TopBar content={searchbar}
				withSafeArea
			/>
		)
	}

	renderSearchPanel() {
		if( !this.state.searchingPlace ) return;

		return (
			<SearchPlacePanel
				location={ this.state.regionInView }
				query={ this.state.searchQuery }
				visible={this.state.showingSearchOverlay }
				mapActions={ this.props.actions.map }
				onSelect={ this._onSelectSearchPlace } />
		);
	}

	renderMap() {
		let story = this.getStory();
		let isLocationSelected = this.state.locationSelected;

		return (
			<StoryMap
				region={ this.state.regionInView }
				storyLocation={ this.state.storyLocation }
				discoveryRadius={ this.state.discoveryRadius }
				dragMode={ !isLocationSelected && this.state.dragActive }
				showMarker={ true }
				showCircle={ isLocationSelected }
				onRegionChangeComplete={ this._onUpdateRegion }
				onPoiClick={ this._onPressPoi }
				places={ !isLocationSelected && !this.state.dragActive && this.state.places }
				onPressPlace={ this._onPressMapPlace }
				onPressCurrentLocation={ this._onPressCurrentLocation }
				currentPosition={ !isLocationSelected && this.props.position }>
			</StoryMap>
		);
	}

	renderMapControls(){
		if( this.state.locationSelected ) return;

		let dragActive = this.state.dragActive;
		
		return (
			<View style={ styles.mapControls }>
				<Button color={ dragActive ? 'secondary' : 'white' }
					type="iconFilled"
					icon="touch-app"
					size="s"
					withShadow
					style={{ opacity: .85}}
					onPress={ this._toggleDrag } />
			</View>
		);
	}

	renderLocationNotGranted() {
		return (
			<NoLocationScreen { ...this.props }>
				<Text>
					You need to enable access to the location in order to create new stories.
				</Text>
			</NoLocationScreen>
		);
	}

	getUserPlace( location ){
		let address = this.loadAddress(location);
		if( address ){
			return {
				name: this.getFormatedAddress( address ),
				type: 'address'
			}
		}
	}

	getFormatedAddress( address ){
		if( address ){
			if( address.formatted ){
				return address.formatted.split(',').slice(0,2).join(',');
			}
			return address;
		}
	}

	_startSearch = () => {
		// First mount the search panel
		this.setState({ searchingPlace: true }, () => {
			// Then make it visible
			this.setState({ showingSearchOverlay: true });
		});
	}

	_endSearch = () => {
		// First hide the search panel
		this.setState({ showingSearchOverlay: false }, () => {
			setTimeout(() => {
				// Then unmount it
				this.setState({ searchingPlace: false, searchQuery: '' });
			}, 300);
		})
	}

	_onUpdateSearchQuery = q => {
		this.setState({ searchQuery: q });
	}

	_toggleDrag = () => {
		this.setState( {dragActive: !this.state.dragActive} )
	}

	_onUpdateRegion = r => {
		console.log('update region', r);

		if( this.state.dragActive ){
			let latLng = locationToLng(r);
			this.props.actions.map.loadLocationAddress( latLng )
				.then( () => {
					this.setState({
						regionInView: r,
						storyLocation: {
							location: latLng,
							place: this.getCustomPlace() || this.getUserPlace( r )
						}
					});
				})
			;
		}
		this.setState({regionInView: r});
	}

	_onSelectSearchPlace = place => {
		console.log('Place selected!', place);
		this._onSelectLocation({
			place: {
				name: place.name,
				type: 'place',
				sourceId: place.sourceId
			},
			location: place.location
		});
		this._endSearch();
	}

	_onSelectLocation = selection => {
		let delta = this.getDelta( this.state.discoveryRadius );
		let region = {
			...this.getRegion( lngToLocation(selection.location) ),
			longitudeDelta: delta,
			latitudeDelta: delta
		};
		
		this.setState({
			locationSelected: true,
			storyLocation: selection,
			regionInView: region
		});
	}

	_onPressMapPlace = place => {
		this.setState({
			storyLocation: {
				location: place.location,
				place: this.getCustomPlace() || place
			},
			regionInView: {
				...this.state.regionInView,
				longitude: place.location.lng,
				latitude: place.location.lat
			}
		});
	}

	_onPressCurrentLocation = () => {
		const position = this.props.position;
		const place = this.getCustomPlace() ||
			this.getUserPlace( position )
		;

		const stateUpdate = {
			storyLocation: {
				location: locationToLng( position ),
				place
			},
			regionInView: {
				...this.state.regionInView,
				longitude: position.longitude,
				latitude: position.latitude
			}
		};

		this.setState( stateUpdate );
	}

	_onPressPoi = e => {
		if( !this.state.dragActive ) return;

		let poi = e.nativeEvent;

		// console.log(poi)

		// Make a fake place with it
		let place = {
			location: {
				lat: poi.coordinate.latitude,
				lng: poi.coordinate.longitude
			},
			name: poi.name,
			sourceId: poi.placeId,
			ne: { lat: 0, lng: 0 },
			sw: { lat: 0, lng: 0 }
		}

		this.setState({
			storyLocation: {
				location: place.location,
				place: this.getCustomPlace() || place 
			},
			regionInView: {
				...this.state.regionInView,
				...poi.coordinate
			}
		});
	}

	_openEditLocation = () => {
		Modal.open(
			<EditLocationModal
				initialLocation={ this.state.storyLocation.place.name }
				onFinish={ this._onEditLocation }
			/>,
			{keyboardPadding: true}
		);
	}

	_onEditLocation = customLocation => {
		this.setState({
			customLocation,
			storyLocation: {
				...this.state.storyLocation,
				place: this.getCustomPlace( customLocation )
			}
		});
	}

	_closeMap = () => {
		let mapScreen = this.refs.mapScreen;
		mapScreen && mapScreen.closeMap();
	}

	_onBackPress = () => {
		if( this.isOnScreen() && this.state.locationSelected ){
			this.setState({locationSelected: false});
			return true;
		}
		return false;
	}
	
	isOnScreen() {
		return this.props.location.pathname === '/createStory';
	}

	getCustomPlace( customLocation? ){
		let cl = customLocation || this.state.customLocation;
		if( cl ){
			return {
				type: 'custom',
				name: cl
			}
		}
	}

	getRegion( position ){
		if( !position ) {
			return {
				latitude: 37.39,
				longitude: -5.98,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			}
		};

		return {
			latitude: position.latitude,
			longitude: position.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01
		}
	}

	loadAddress( location ) {
		if( !location ) return false;

		const latLng = locationToLng(location);
		let address = storeService.getLocationAddress(latLng);

		if( !address ){
			this.props.actions.map.loadLocationAddress(latLng)
				.then(() => {
					let stateUpdate: any = {
						userAddress: storeService.getLocationAddress(latLng)
					};

					if( !this.state.storyLocation.place ){
						stateUpdate.storyLocation = {
							location: locationToLng( location ),
							place: this.getCustomPlace() || this.getUserPlace( location )
						};
					}

					this.setState( stateUpdate );
				})
			;
		}

		return address;
	}

	loadPlaces(location) {
		if (!location) return false;

		const latLng = locationToLng(location);
		let places = storeService.getPlacesNearby(latLng);

		if (!places) {
			this.props.actions.map.loadPlacesNearby(latLng, this.getPlacesRadius(location.accuracy))
				.then(() => {
					let places = storeService.getPlacesNearby(latLng);
					this.setState({ places });
				})
			;
		}

		return places;
	}

	getPlacesRadius( accuracy ){
		if( accuracy < 50 ) return 50;
		if( accuracy > 200 ) return 200;
		return accuracy;
	}


	_onChangeArea = discoveryRadius => {
		let delta = this.getDelta( discoveryRadius );

		this.setState({
			discoveryRadius,
			regionInView: {
				...this.getRegion(lngToLocation(this.state.storyLocation.location)),
				longitudeDelta: delta,
				latitudeDelta: delta
			}
		});
	}

	getDelta( radius ){
		switch( radius ){
			case(10):
				return .001;
			case 100:
				return .01;
			case 1000:
				return .1;
			case 10000:
				return 1;
			case 100000:
				return 10;
		}
	}

	_onSelectArea = () => {
		let story = this.getStory();

		let { discoveryRadius, storyLocation, regionInView } = this.state;

		story.discoveryRadius = discoveryRadius;
		story.region = this.plainJS( regionInView );
		story.place = this.plainJS( storyLocation.place );
		story.location = this.plainJS( storyLocation.location );

		this.props.router.navigate('/createStory/addContent');
	}

	getStory(){
		let {store} = this.props;
		return this.props.actions.story.getStoryInProgress( store.user.id );
	}

	preloadFollowers(){
		const {store, actions} = this.props;
		const followers = store.user.followers;

		if( !followers || !followers.items || !followers.valid ){
			actions.relationship.loadUserFollowers();
		}
	}

	hasLocationPermission() {
		let perm = this.props.store.locationPermissions
		return perm && perm.granted;
	}

	componentWillUnmount() {
		BackButtonHandler.removeListener( this._onBackPress );
		this.props.actions.story.clearStoryInProgress();
		BgLocation.stopTracking();
	}

	componentWillEnter() {
		this._closeMap();
	}

	plainJS( ob ){
		return JSON.parse( JSON.stringify(ob) );
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch'
	},
	searchBar: {
	},
	map: {
		height: 1000,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ddd',
		position: 'relative',
		zIndex: 1
	},
	panel: {
		flex: 1
	},
	mapControls: {
		paddingTop: 10,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	}
});


export default PositionProvider(CreateStory);