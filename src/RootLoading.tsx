import * as React from 'react'
import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import { Logo, styleVars, LoadingBar } from './components'


interface RootLoadingProps {
  finished: boolean
}

export default class RootLoading extends React.Component<RootLoadingProps> {
  position = new Animated.Value(0);

  render() {
    let containerStyles = [
      styles.loadingContainer,
      { transform: [{translateX: this.position}] }
    ];

    return (
      <Animated.View style={ containerStyles }>
        <Logo textColor={ styleVars.colors.blueText }
          size={50} />
        <View style={ styles.barContainer}>
          <LoadingBar finished={ this.props.finished } />
        </View>
      </Animated.View>
    )
  }

  componentDidUpdate( prevProps ){
    if( !prevProps.finished && this.props.finished ){
      console.log('Finished signal received');
      setTimeout( () => {
        console.log('Moving loading out');
        Animated.timing( this.position, {
          toValue: -2000,
          duration: 300
        }).start();
      }, 200)
    }
  }
}

const styles = StyleSheet.create({
	loadingContainer: {
		alignItems: 'center',
		justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 1000
  },
  barContainer: {
    width: 120,
    marginTop: 20
  }
});
