import * as React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Button } from '../../components';
import { MaterialIcons } from '@expo/vector-icons';
import Flash from './Flash';

interface LocationSelectorProps {
	onSelect: Function,
	userLocation: any,
	storyLocation: any,
	places: any,
	dragMode: boolean,
	onEditLocationName: () => void
}

export default class LocationSelector extends React.PureComponent<LocationSelectorProps> {
	state = {
		flashing: false
	}

	render() {
		return (
			<View style={styles.container}>
				{ this.renderCurrentSelection() }
				{ this.renderPlaces() }
			</View>
		);
	}

	getSelectTitle(){
		if( this.props.dragMode ){
			return 'Select this location';
		}

		let place = this.props.storyLocation.place;
		
		if( place && place.type === 'address' ){
			return 'Select my current location';
		}
		
		return 'Select this place';
	}

	getSelectSubtitle() {
		let place = this.props.storyLocation.place;
		return place && place.name || '';
	}

	renderCurrentSelection(){
		let icon = (
			<View style={{ marginRight: 16 }}>
				<MaterialIcons name="my-location" size={32} color="#949494" />
			</View>
		);

		let editButton = (
			<Button type="transparent" onPress={ this._onEditLocationName }>
				Edit
			</Button>
		);

		return (
			<View style={{overflow: 'hidden'}}>
				{ this.renderFlash() }
				<ListItem
					title={ this.getSelectTitle() }
					subtitle={this.getSelectSubtitle()}
					pre={icon}
					post={editButton}
					style={ [styles.listItem, styles.currentSelectionWrapper] }
					onPress={this._selectCurrentLocation} />
			</View>
		)
	}

	renderFlash(){
		if( !this.state.flashing ) return;

		return (
			<View style={styles.flash}>
				<Flash />
			</View>
		)
	}

	renderPlaces(){
		const places = this.props.places
		if( !places ) return;

		return (
			<ScrollView style={ styles.placesWrapper }
				nestedScrollEnabled={ true }
				contentContainerStyle={styles.placesList}>
					{ places.map( this._renderPlace )}
			</ScrollView>
		)
	}

	_renderPlace = place => {
		const icon = (
			<View style={ styles.placeIconWrapper }>
				<MaterialIcons
					name={ placeIcons[ place.type ] || placeIcons.default }
					size={ 26 }
					color="#949494" />
			</View>
		)

		return (
			<ListItem
				key={place.sourceId}
				onPress={ () => this.selectPlace(place) }
				style={ styles.listItem }
				title={ place.name }
				pre={ icon } />
		)
	}

	_selectCurrentLocation = () => {
		this.props.onSelect( this.props.storyLocation );
	}

	_onEditLocationName = () => {
		this.props.onEditLocationName();
	}

	selectPlace( place ) {
		let selection: any = {
			place: {type: 'place', name: place.name, sourceId: place.sourceId}
		}

		if( this.isLocationInPlace( this.props.userLocation, place ) ){
			selection.location = { ...this.props.userLocation };
		}
		else {
			selection.location = { ...place.location };
		}

		this.props.onSelect( selection );
	}

	isLocationInPlace( location, place ){
		let {ne, sw} = place;

		return location.lat < ne.lat && 
			location.lat > sw.lat &&
			location.lng < ne.lng &&
			location.lng > sw.lng
		;
	}

	componentDidUpdate( prevProps ){
		if( prevProps.storyLocation !== this.props.storyLocation ){
			this.setState({flashing: true});
			setTimeout( () => this.setState({flashing: false}), 1000);
		}

		if( prevProps.places !== this.props.places ){
			// console.log(this.props.places);
		}
	}
};

const styles = StyleSheet.create({
	container: {
		paddingBottom: 10,
		flex: 1,
	},

	currentSelectionWrapper: {
		paddingTop: 10,
		paddingBottom: 10,
		height: 70
	},

	placesWrapper: {
		borderTopWidth: 1,
		borderTopColor: '#E6EAF2',
		paddingTop: 10,
		overflow: 'hidden'
	},

	placesList: {
	},

	placeIconWrapper:{
		marginRight: 16,
		borderRadius: 16,
		backgroundColor: '#eee',
		width: 36, height: 36,
		alignItems: 'center',
		justifyContent: 'center',
	},
	listItem: {
		height: 50,
		paddingLeft: 20,
		paddingRight: 20
	},
	flash: {
		position: 'absolute',
		top: 30, left: 36
	}
});

const placeIcons = {
	cafe: 'local-cafe',
	city: 'location-city',
	drink: 'local-bar',
	food: 'local-dining',
	fun: 'local-activity',
	lodging: 'hotel',
	money: 'locat-atm',
	museum: 'account-balance',
	official: 'account-balance',
	plane: 'flight',
	service: 'business-center',
	shop: 'local-grocery-store',
	transport: 'airport-shuttle',
	place: 'location-on',
	default: 'location-on'
}