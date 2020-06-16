import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SettingCard, Text } from '../../components';
import { MaterialIcons } from '@expo/vector-icons';


interface FollowerCardProps   {
	account: any,
	meta: any
}

export default class FollowerCard extends Component<FollowerCardProps> {
  render() {
    let { meta } = this.props;
    if( !meta ) return null;

    let items = [
      this.getFollowingItem( meta )
    ];

    return (
      <SettingCard items={ items } />
    )
  }

  getFollowingItem( meta ){
    if( !meta.isFollower ){
      return {
        content: (
          <View style={ styles.item }>
            <View style={{marginRight: 10}}>
              <MaterialIcons name="sentiment-dissatisfied" size={ 24 } />
            </View>
            <View style={{flex: 1}}>
              <Text type="title" color="black" style={{flexWrap: 'wrap'}}>
                { meta.hasBeenFollower ? `${this.getShortName()} is not following you anymore` : `${this.getShortName()} is not following youuuuu` }
              </Text>
            </View>
          </View>
        )
      }
    }
    
    return {
      title: 'Follows you',
      subtitle: `Since ${ meta.followerSince }`
    }
  }

  getShortName() {
		let displayName = this.props.account.displayName;
		let parts = displayName.split('\s+');
		return parts[0];
	}
}


const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    overflow: 'hidden'
  }
});