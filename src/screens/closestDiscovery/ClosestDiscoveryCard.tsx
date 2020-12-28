import * as React from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import { Button, Text, Wrapper } from '../../components';
import LocationService, { LocationFence, StoredPermissions } from '../../location/location.service';

interface ClosestDiscoveryCardProps {
  permissions: StoredPermissions,
  fence?: LocationFence
}

export default class ClosestDiscoveryCard extends React.Component<ClosestDiscoveryCardProps> {
  state = {
    loading: false
  }

  render() {
    const {permissions, fence} = this.props;
    let permission = permissions.foreground;
    if( permission && !permission.isGranted ){
      return this.renderNoPermissionCard();
    }

    if( !fence ){
      return this.renderUnknownDiscoveriesCard();
    }

    if( fence.distanceToDiscovery === -1 ){
      return this.renderNoDiscoveriesCard();
    }

    return this.renderDistanceCard();
  }

  renderDistanceCard(){
    let distance = this.getDistanceToDiscovery();
    return (
      <View style={styles.card}>
        <Wrapper textWidth>
          <Text style={{textAlign: 'center'}}>
            El descubrimiento más cercano está a...
          </Text>
        </Wrapper>
        <View style={styles.distance}>
          <Text type="superHeader">
            {distance.quantity}
            <Text type="header">
              {' ' + distance.units}
            </Text>
          </Text>
        </View>
        <Wrapper textWidth>
          <Text style={{textAlign: 'center'}}>
            La zona azul del mapa muestra dónde podría esconderse la historia.
          </Text>
        </Wrapper>
      </View>
    )
  }

  renderNoDiscoveriesCard(){
    return (
      <View style={styles.card}>
        <Wrapper textWidth>
          <Text style={styles.m10}>
            You've discovered all your friends' stories.
          </Text>
          <Text style={styles.m20}>
            Try to follow new people to have more discoveries available.
          </Text>
          <View style={{alignSelf: 'stretch'}}>
            <Button link="/myPeople/morePeople">
              Find more people
            </Button>
          </View>
        </Wrapper>
      </View>
    )
  }

  renderUnknownDiscoveriesCard(){
    return (
      <View style={styles.card}>
        <Wrapper textWidth>
          <Text style={{textAlign: 'center'}}>
            El descubrimiento más cercano está a una distancia desconocida.
          </Text>
        </Wrapper>
      </View>
    )
  }

  renderNoPermissionCard(){
    return (
      <View style={styles.card}>
        <Wrapper textWidth style={styles.m20}>
          <Text style={{textAlign: 'center'}}>
            Discov need access to your location to know how far are the discoveries.
          </Text>
        </Wrapper>
        <View style={{alignSelf: 'stretch'}}>
          <Button onPress={ this._askForPermission } loading={ this.state.loading }>
            Enable location
          </Button>
        </View>
      </View>
    )
  }

  getDistanceToDiscovery(){
    let distance = this.props.fence.distanceToDiscovery;
    if( distance < 1000 ){
      return {
        quantity: 1000,
        units: 'm'
      };
    }
    if( distance < 5000 ){
      return {
        quantity: (Math.round( distance / 100 ) / 10), 
        units: 'km'
      };
    }

    return {
      quantity: Math.round( distance / 1000 ), 
      units: 'km'
    };
  }

	canAskForLocation() {
		let perm = this.props.permissions.foreground;
		return !perm || perm.canAskAgain;
	}

	_askForPermission = () => {
    if( this.canAskForLocation() ){
      this.setState({loading: true});
      LocationService.requestPermission()
        .then( () => {
          this.setState({loading: false});
        })
      ;
    }	
    else {
      Linking.openSettings();
    }
	}
}

const styles = StyleSheet.create({
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
  m10: {
    marginBottom: 10
  },
  m20: {
    marginBottom: 20
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})