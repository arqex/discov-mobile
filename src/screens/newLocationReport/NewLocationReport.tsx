import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { Bg } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';

interface NewLocationReportProps extends ScreenProps {};

let windowWidth = Dimensions.get('window').width;
const bgColors = ['#ffffff', '#fafafa'];
class NewLocationReport extends React.Component<NewLocationReportProps> {
	render() {
		let locations = this.getLocations();

		return (
			<Bg style={ styles.container }>
				<View style={ styles.map }>
					<MapView
						style={{ display: 'flex', flexGrow: 1, width: windowWidth }}>
							{ this.renderMarkers( locations ) }
					</MapView>
				</View>
				<View style={ styles.items }>
					<FlatList
						data={ locations.order }
						renderItem={ this._renderLocation }
						keyExtractor={ item => item }
					/>
				</View>
			</Bg>
		);
	}

	renderMarkers( locations ){
		let locationCount = locations.order.length;

		return locations.order.map( (id,i) => {
			let location = locations.items[id];
			let coords = location.coords ? location.coords : location
			let st = [
				styles.placeMarker,
				{ backgroundColor: colorFromIndex(i, locationCount) }
			];
			return (
				<Marker
					key={ id }
					coordinate={ coords }>
						<View style={styles.placeMarkerWrapper}>
							<View style={st} />
						</View>
				</Marker>
			);
		});
	}

	_renderLocation = ({item, index}) => {
		let locations = this.getLocations();
		let location = locations.items[item];
		let rowStyle = [
			styles.row,
			{
				backgroundColor: this.getRowColor(location.batchId),
				borderLeftColor: colorFromIndex(index, locations.order.length )
			}
		];
		
		return (
			<View style={ rowStyle }>
				{ this.renderDate( location.timestamp ) }
				<View style={ styles.source }>
					<Text>{ location.initiator }</Text>
				</View>
				{ this.renderResult( location.result ) }
			</View>
		);
	}

	renderDate( ts ){
		let formatted = this.formatDate(ts).split(' ');
		return (
			<View style={ styles.time }>
				<Text>{formatted[0]}</Text>
				<Text>{formatted[1]}</Text>
			</View>
		);
	}

	renderResult( result ){
		let end = result ? ( result.error || 'OK' ) : 'Loading...';
		return (
			<View style={styles.result}>
				<Text>{ end }</Text>
			</View>
		);
	}

	getLocations(){
		return this.props.store.locationReport;
	}


	formatDate(t) {
		let d = new Date(t);
		return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	}

	lastColorIndex = 0;
	batchColors = {};
	getRowColor( batchId ){
		if (this.batchColors[batchId]) return this.batchColors[batchId];
		let nextIndex = this.lastColorIndex ? 0 : 1;
		this.lastColorIndex = nextIndex;
		return this.batchColors[batchId] = bgColors[nextIndex];
	}
}

function pad(n) {
	if (n < 10) {
		return `0${n}`;
	}
	return n;
}

function colorFromIndex( index, total ){
	let color = Math.round( index / total * 255 );
	return `rgb(${ color },${255 - color}, 0)`;
}

export default NewLocationReport;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	map: {
		height: Dimensions.get('window').height / 3,
		backgroundColor: 'red',
		alignItems: 'stretch',
		justifyContent: 'center'
	},
	items: {
		height: Dimensions.get('window').height / 3 * 2,
		backgroundColor: 'white'
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		borderLeftWidth: 10,
		paddingLeft: 10,
		paddingRight: 20,
		paddingBottom: 8,
		paddingTop: 8,
		alignItems: 'stretch'
	},
	time: {
		width: 70,
		marginRight: 8
	},
	source: {
		marginRight: 8,
		flex: 1
	},
	result: {
		width: 70,
		alignItems: 'flex-end'
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
});
