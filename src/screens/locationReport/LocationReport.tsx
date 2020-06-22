import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Button } from '../../components';
import store from '../../state/store';

export default class LocationReport extends Component<ScreenProps> {
	render() {
    let store = this.props.store;
    let locations = store && store.locationReport || [];

    return (
      <ScrollView contentContainerStyle={ styles.container }>
        <Text>Location report ({locations.length})</Text>
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
        <Text>{ this.formatDate(location.date) }</Text>
        <Text>{ location.longitude } { location.latitude }</Text>
        <Text>{ location.accuracy }</Text>
      </View>
    )
  }

  _clearLocationReport = () => {
    store.locationReport = [];
    this.forceUpdate();
  }
  
  formatDate( time ){
    let d = new Date(time).toISOString();
    d = d.split('-').slice(1).join('-');
    d = d.split('.')[0];
    return d.replace('T', ' ');
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
