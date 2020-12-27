import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import MapView, {Marker, Polygon} from 'react-native-maps';
import LocationService, { BgLocation, LocationFence } from '../../location/location.service';
import { getRegion } from '../../utils/maps';

interface ClosestDiscoveryMapProps {
  fence?: LocationFence,
  position?: BgLocation
}

export default class ClosestDiscoveryMap extends React.Component<ClosestDiscoveryMapProps> {

  map = React.createRef()

  render() {
    const {fence, position} = this.props;
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

  lastRegionKey = 'noregion'
  componentDidUpdate() {
    let fence = this.props.fence;
    if( !fence ) return;
    let regionKey = `${fence.location.longitude}-${fence.location.latitude}`;
    if( regionKey !== this.lastRegionKey && this.map.current ){
      this.lastRegionKey = regionKey;
      this.map.current.animateToRegion( this.getRegion(null, fence) );
    }
    LocationService.startTracking();
  }
}


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

const styles = StyleSheet.create({
  map: {
    flex: 1
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