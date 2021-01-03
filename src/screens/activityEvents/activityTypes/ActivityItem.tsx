import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Avatar, LoadingText } from '../../../components'
import AccountAvatar from '../../components/AccountAvatar';


interface AccountActivity {
  id: string
  accountId: string
  type: string
  createdAt: string
  extra: any
}

interface ActivityItemProps {
  relatedAccount?: PeerAccount
  loading: boolean
}


const AVATAR_SIZE = 30

export default class ActivityItem extends Component<ActivityItemProps> {
  render() {
    if( this.props.loading ){
      return this.renderLoading();
    }

    return (
      <View style={styles.container}>
        { this.renderImage() }
        { this.renderText() }
      </View>
    )
  }

  renderImage() {
    let { relatedAccount, loading } = this.props;

    if( loading ){
      return AccountAvatar.wrappedComponent.renderLoading({size: AVATAR_SIZE});
    }
    else if( relatedAccount ){
      return (
        <Avatar pic={ relatedAccount.avatarPic }
          name={ relatedAccount.displayName }
          size={ AVATAR_SIZE } />
      )
    }
  }

  renderText() {
    let { loading, children } = this.props;
    let text = loading ? 
      <LoadingText>Some placeholder text to show in the activity using 2 lines.</LoadingText> :
      children
    ;

    return (
      <View style={ styles.text }>
        { text }
      </View>
    )
  }

  renderLoading() {
    return (
      <View style={styles.container}>
        {  }
         
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  text: {

  }
})