import * as React from 'react'
import { Animated } from 'react-native'

export default class Flash extends React.Component {
  animatedScale = new Animated.Value(1)
  animatedOpacity = new Animated.Value(1)

  render() {
    let styles = {
      backgroundColor: '#ccddF2',
      height: 10, width: 10,
      borderRadius: 5,
      opacity: this.animatedOpacity,
      transform: [
        {scale: this.animatedScale}
      ]
    }

    return (
      <Animated.View style={ styles }></Animated.View>
    )
  }

  componentDidMount() {
    Animated.timing( this.animatedScale, {
      toValue: 80,
      duration: 1000,
      useNativeDriver: true
    }).start();

    Animated.timing( this.animatedOpacity, {
      toValue: 0,
      duration: 1600,
      useNativeDriver: true
    }).start();
  }
}
