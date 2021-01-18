import * as React from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Text } from '../../components';
import AccountAvatar from './AccountAvatar';
import Flash from '../createStory/Flash';

interface UnseenDiscoveryProps {
  story: any,
  onReveal: (storyId: string) => any
}

export default class StoryCard extends React.PureComponent<UnseenDiscoveryProps> {
  scale = new Animated.Value(1)

  state = {
    flash: false
  }
  
	render() {
    let story = this.props.story;
    
    let cardStyles = [
      styles.content,
      {transform: [{scale: this.scale}]}
    ];

		return (
      <Pressable onPressIn={ this._onPressStart } onPressOut={ this._onPressEnd } style={styles.container}>
        <Animated.View style={ cardStyles } >
          {this.renderFlash()}
          <View style={{ marginBottom: 4 }}>
            <AccountAvatar
              accountId={story && story.ownerId}
              size={60} />
          </View>
          <View style={{ marginBottom: 2 }}>
            <Text type="mainTitle">{__('myDiscoveries.newStory')}</Text>
          </View>
          <Text>{__('myDiscoveries.tapme')}</Text>
        </Animated.View>
			</Pressable>
		);
  }

  renderFlash() {
    return (
      <View style={ styles.flash }>
        <Flash />
      </View>
    );
  }

  _reveal = () => {
    const { story } = this.props;
    this.props.onReveal( story.id );
  }

  _onPressStart = () => {
    Animated.timing( this.scale, {
      toValue: 1.1,
      useNativeDriver: true,
      duration: 500,
      easing: Easing.out( Easing.cubic )
    }).start();
  }

  _onPressEnd = e => {
    console.log( e );

    Animated.timing( this.scale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300,
    }).start();

    if( e?.dispatchConfig?.registrationName !== 'onResponderTerminate'){
      this._reveal();
    }
  }
  
  componentDidMount() {
    setTimeout( () => {
      this.setState({flash: true});
    }, 500);
  }
};

const styles = StyleSheet.create({
	container: {
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },

  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EAF2',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  
  flash: {
    position: 'absolute',
    marginLeft: 15,
    top: '46%', left: '50%'
  }
});