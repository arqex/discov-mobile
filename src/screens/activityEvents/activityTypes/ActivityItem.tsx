import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar, LoadingText, styleVars, Touchable, Wrapper } from '../../../components'
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
  isFirst: boolean,
  isLast: boolean,
  router: any,
  action: string,
}

export interface ActivityTypeProps {
  activity: AccountActivity,
  isFirst: boolean,
  isLast: boolean,
  router: any
}


const AVATAR_SIZE = 50

export default class ActivityItem extends Component<ActivityItemProps> {
  render() {
    return (
      <Touchable onPress={ () => this.props.router.navigate(this.props.action) }>
        <View style={styles.container}>
          { this.renderTopBorder() }
          <View style={ styles.content }>
            { this.renderImage() }
            <Wrapper textWidth>
              { this.renderText() }
            </Wrapper>
          </View>
          { this.renderBottomBorder() }
        </View>
      </Touchable>
    )
  }

  renderImage() {
    let { relatedAccount, loading } = this.props;

    if( loading ){
      return (
        <View style={ styles.image }>
          {AccountAvatar.wrappedComponent.renderLoading({size: AVATAR_SIZE})}
        </View>
      );
    }
    else if( relatedAccount ){
      return (
        <View style={ styles.image }>
          <Avatar pic={ relatedAccount.avatarPic }
            name={ relatedAccount.displayName }
            size={ AVATAR_SIZE } />
        </View>
      )
    }
  }

  renderText() {
    let { loading, children } = this.props;

    return (
      <View style={ styles.text }>
        { loading ? this.renderLoadingText() : children }
      </View>
    )
  }

  renderLoadingText(){
    return (
      <View style={styles.loadingText}>
        <View style={{marginBottom: 5}}>
          <LoadingText>This is the long first line, fullwidth</LoadingText>
        </View>
        <LoadingText>This is the second</LoadingText>
      </View>
    )
  }

  renderTopBorder(){
    if( this.props.isFirst ){
      return <View style={ styles.firstBorder } />;
    }
  }

  renderBottomBorder() {
    if( this.props.isLast ){
      return <View style={ styles.lastBorder } />
    }
    else {
      return (
        <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
          <View style={ styles.bottomBorder } />
        </View>
      )
    }
    return 
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  content: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {

  },
  image: {
    marginRight: 10
  },
  loadingText: {
    justifyContent: 'flex-start'
  },

  firstBorder: {
    height: 10,
    backgroundColor: 'white',
    borderColor: styleVars.colors.borderBlue,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastBorder: {
    height: 10,
    backgroundColor: 'white',
    borderColor: styleVars.colors.borderBlue,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bottomBorder: {
    width: '50%',
    height: 1,
    backgroundColor: styleVars.colors.borderBlue
  }
})