import * as React from 'react'
import { View, Animated, StyleSheet } from 'react-native'

/**
 * This component is now only behaving like a loading bar with an undetermined percentage
 * Update it in the future to accept percentages
 */

interface LoadingBarProps {
  finished?: boolean
}

export default class LoadingBar extends React.Component<LoadingBarProps> {
  barWidth = new Animated.Value(.2);
  barPosition = new Animated.Value(-120);
  positionAnimation: any;
  widthAnimation: any;

  render() {
    let progressStyles = [
      styles.progress,
      
      { transform: [
        {translateX: this.barPosition},
        {scaleX: this.barWidth}
      ]}
      
    ];

    return (
      <View style={ styles.container } onLayout={ this._onLayout }>
        <Animated.View style={ progressStyles }>
        </Animated.View>
      </View>
    );
  }

  _onLayout = e => {
    let width = e.nativeEvent.layout.width;
    if( !this.props.finished ){
      this.animate( width );
    }
  }

  animate( width ){

    this.positionAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing( this.barPosition, {
          toValue: width,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    );
    this.positionAnimation.start();
    
    this.widthAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing( this.barWidth, {
          toValue: .9,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing( this.barWidth, {
          toValue: .5,
          duration: 2500,
          useNativeDriver: true
        })
      ])
    );

    this.widthAnimation.start();
  }

  componentDidUpdate( previousProps ){
    if( this.props.finished && !previousProps.finished ){

      // console.log('stopping animation', this.widthAnimation)
      this.widthAnimation && this.widthAnimation.stop();
      this.positionAnimation && this.positionAnimation.stop();

      Animated.timing( this.barWidth, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
      
      Animated.timing( this.barPosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }).start();
    }
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.1)',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  progress: {
    backgroundColor: '#1E2F55',
    height: 6,
    borderRadius: 3,
    width: '100%',
    transform: [{translateX: 100}]
  }
})