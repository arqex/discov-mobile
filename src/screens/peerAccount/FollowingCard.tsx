import React, { Component } from 'react';
import { SettingCard } from '../../components';
import { Alert } from 'react-native';


interface FollowingCardProps   {
	account: any,
	meta: any,
  onFollow: Function,
  onUnfollow: (value?: string) => void,
  loading
}

export default class FollowingCard extends Component<FollowingCardProps> {
  render() {
    let { meta } = this.props;
    if( !meta ) return null;
    
    let items = [
      this.getFollowingItem()
    ];

    let discoveriesItem = this.getDiscoveriesItem();
    if( discoveriesItem ){
      items.push( discoveriesItem );
    }

    return (
      <SettingCard items={ items } />
    )
  }

  getFollowingItem(){
    let { meta } = this.props;

    if( !meta.following ) {
      return this.getNotFollowingItem( meta, meta.hasBeenFollowed ? 'Not following anymore' : 'Not following' );
    }
    return {
      title: 'Following',
      subtitle: `Since ${ meta.followingSince }.`,
      button: 'Unfollow',
      loading: this.props.loading,
      onButtonPress: this._confirmUnfollow
    }
  }

  getNotFollowingItem( meta, title ){
    let subtitle = meta.discoveryCount.all ?
      `${ this.getShortName() } has ${ meta.discoveryCount.all } stories available for you to discover.` :
      `Follow to start discovering about ${ this.getShortName() }`
    ;

    return {
      title: title,
      subtitle,
      button: 'Follow',
      loading: this.props.loading,
      onButtonPress: this.props.onFollow,
    }
  }

  getDiscoveriesItem() {
    let { meta } = this.props;
    let { all, discovered } = meta.discoveryCount;

    if( !discovered && !all ){
      return;
    }
    
    if( meta.following || discovered ){
      let item: any = {
        title: `Discovered ${ discovered } out of ${ Math.max( discovered, all ) } ${ this.getShortName() }'s available stories`
      };
      if( discovered ){
        item.button = 'See',
        item.onButtonPress = () => Alert.alert('See not implemented yet')
      }
      return item;
    }
  }

  getShortName() {
		let displayName = this.props.account.displayName;
		let parts = displayName.split('\s+');
		return parts[0];
  }
  
  _confirmUnfollow = () => {
    Alert.alert(
      `Unfollow ${ this.props.account.displayName }`,
      `Are you sure? After unfollowing, you won't be able to discover any new story from ${ this.getShortName() }`,
      [
        { text: 'Cancel' },
        { text: 'Unfollow', onPress: this.props.onUnfollow, style: 'destructive' }
      ]
    );
  }
}
