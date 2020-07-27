import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Button } from '../../components';
import store from '../../state/store';
import locationHandler from '../../location/location.handler';

export default class LocationReport extends Component<ScreenProps> {
	render() {
    let store = this.props.store;
    let locations = store && store.locationReport || [];
    let fenceData = locationHandler.getFenceData();

    return (
      <ScrollView contentContainerStyle={ styles.container }>
        <Text>Location report ({locations.length})</Text>
        <Text>In fence: { fenceData.passiveFence ? 'true' : 'false' }</Text>
        <Text>Distance from out of the fence: { fenceData.distanceFromOutOfFence }</Text>
        <Button onPress={ this._clearLocationReport }>Clear report</Button>
        <View style={ styles.location }>
          <Text>date</Text>
          <Text>lon/lat</Text>
          <Text>accuracy</Text>
        </View>
        { locations.map( this._renderLocation ) }
      </ScrollView>
    )
  };

	_renderLocation = location => {
    return (
      <View style={ styles.location }>
        <Text>{this.getWildcard(location) + this.formatDate(location.date) }</Text>
        <Text>{ location.longitude } / { location.latitude }</Text>
        <Text>{ location.accuracy }</Text>
      </View>
    )
  }

  getWildcard( location ){
    return location.isBgFetch ? '* ' : '';
  }

  _clearLocationReport = () => {
    store.locationReport = [];
    this.forceUpdate();
  }
  
  
  formatDate(t) {
    let d = new Date(t).toLocaleString();
    let date = d.split('/').slice(0, 2).join('/');
    let time = d.split(' ');

    return `${date} ${time}`;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 50,
    width: '100%',
    alignItems: 'stretch'
  },
	location: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
    justifyContent: 'space-between'
	}
});
