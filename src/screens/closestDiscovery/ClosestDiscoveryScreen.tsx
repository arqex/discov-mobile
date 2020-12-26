import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import MapView,  {Marker, Circle, Polygon} from 'react-native-maps'
import { Bg, Button, Text, Wrapper } from '../../components'
import LocationService from '../../location/location.service'
import { getRegion } from '../../utils/maps'
import { ScreenProps } from '../../utils/ScreenProps'

export default class ClosestDiscoveryScreen extends React.Component<ScreenProps> {
  render() {
    return (
      <Bg>
        <View style={styles.container}>
          { this.renderMapBar() }
          <View style={styles.map}>
            { this.renderMap() }
          </View>
          <View style={styles.card}>
            <Wrapper textWidth>
              <Text style={{textAlign: 'center'}}>
                El descubrimiento más cercano está a...
              </Text>
            </Wrapper>
            <Text type="superHeader">
              { this.getDistanceToDiscovery() }
            </Text>
            <Wrapper textWidth>
              <Text style={{textAlign: 'center'}}>
              La zona azul del mapa muestra donde podría esconderse la historia.
              </Text>
            </Wrapper>
          </View>
        </View>
      </Bg>
    )
  }

  map = React.createRef()
  renderMap() {
    let position = LocationService.getLastLocation();
    let fence = LocationService.getFence();
    
    return (
      <MapView style={{flex:1, padding: 0}}
        initialRegion={ this.getRegion(position, fence) }
        ref={ this.map }>
        { this.renderCurrentPositionMarker(position) }
        { this.renderCircle(fence) }
      </MapView>
    )
  }

  renderCurrentPositionMarker(position) {
    if( !position ) return;
    return (
      <Marker coordinate={position}>
        <View style={styles.currentPositionMarker} />
      </Marker>
    )
  }

  renderCircle(fence) {
    if( !fence ) return;
    let { location, distanceToDiscovery } = fence;

    return (
      <Polygon
        coordinates={ getCircle( location, this.getOuterCircleRadius(fence) ) }
        holes={ [getCircle(location, distanceToDiscovery )]}
        fillColor="rgba(66,120,255,.5)"
        strokeColor="rgba(66,120,255,.5)"
        />
    )
  }

	renderMapBar() {
		return (
			<View style={styles.mapBar}>
				<Button type="iconFilled"
					icon="arrow-back"
					color="white"
					onPress={ () => this.props.router.back() }
					withShadow />
			</View>
		);
  }

  getRegion( location, fence ){
    if( fence ){
      return getRegion(fence.location.latitude, fence.location.longitude, this.getOuterCircleRadius(fence)*2 + 200);
    }
    if( location ){
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10
      };
    }
  }

  getOuterCircleRadius( fence ){
    return fence.distanceToDiscovery + Math.max(fence.distanceToDiscovery/3, 50);
  }
  
  getDistanceToDiscovery(){
    let fence = LocationService.getFence();
    if( !fence ){
      return "Distancia desconocida";
    }
    let distance = fence.distanceToDiscovery;
    if( !distance ){
      return "Distancia desconocida";
    }

    if( distance < 1000 ){
      return distance + ' m';
    }
    if( distance < 5000 ){
      return (Math.round( distance / 100 ) / 10) + ' km';
    }
    return Math.round( distance / 1000 ) + ' km';
  }
  
  componentDidMount() {
    LocationService.startTracking();
  }

  lastRegionKey = 'noregion'
  componentDidUpdate() {
    let fence = LocationService.getFence();
    if( !fence ) return;
    let regionKey = `${fence.location.longitude}-${fence.location.latitude}`;
    if( regionKey !== this.lastRegionKey && this.map.current ){
      this.lastRegionKey = regionKey;
      this.map.current.animateToRegion( this.getRegion(null, fence) );
    }
    LocationService.startTracking();
  }

  componentWillUnmount() {
    LocationService.stopTracking();
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white'
  },
	mapBar: {
    position: 'absolute',
		marginLeft: 20,
		marginRight: 20
  },
  map: {
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 0,
		borderColor: '#E6EAF2',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    paddingBottom: 40,
    transform: [{translateY: -10}],
    alignItems: 'center'
  },
  currentPositionMarker: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#3366ff',
    borderRadius: 10
  }
})

// Adapted from https://stackoverflow.com/questions/14397874/draw-ring-not-circle-in-google-maps-api
function getCircle(point, radius) { 
  var d2r = Math.PI / 180;   // degrees to radians 
  var r2d = 180 / Math.PI;   // radians to degrees 
  var earthsradius = 6371000;
  
  var points = 32; 

  // find the raidus in lat/lon 
  var rlat = (radius / earthsradius) * r2d; 
  var rlng = rlat / Math.cos(point.latitude * d2r); 

  var extp = [];
  let start = 0;
  let end = points;

  for (var i=start; i < end; i++) { 
    var theta = Math.PI * (i / (points/2)); 
    extp.push({
      latitude: point.latitude  + (rlat * Math.sin(theta)),
      longitude: point.longitude + (rlng * Math.cos(theta))
    });
  } 
  
  return extp;
}