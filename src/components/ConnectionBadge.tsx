import React, { Component } from 'react'
import { View, StyleSheet, Animated, Platform } from 'react-native'
import styleVars from './styleVars';
import Text from './Text';
import { getStatusbarHeight } from './utils/getStatusbarHeight';

interface ConnectionBadgeProps {
  show: boolean
}

export default class ConnectionBadge extends Component<ConnectionBadgeProps> {
  animatedTranslate = new Animated.Value( this.props.show ? 0 : -100 )

  render() {
    let paddingTop = { paddingTop: getStatusbarHeight() - (Platform.OS === 'android' ? 5 : 10) };
    let containerStyles = [
      styles.container
    ];

    let cardStyles = [
      styles.card,
      paddingTop,
      {transform: [{translateY: this.animatedTranslate}]}
    ];

    return (
      <View style={containerStyles}>
        <Animated.View style={ cardStyles }>
          <Text color="white">No internet connection</Text>
        </Animated.View>
      </View>
    );
  }

  componentDidUpdate( prevProps ){
    if( prevProps.show !== this.props.show ){
      Animated.timing( this.animatedTranslate, {
        toValue: this.props.show ? 0 : -100,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    alignItems: 'center'
  },
  card: {
    backgroundColor: styleVars.colors.primary,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  }
})