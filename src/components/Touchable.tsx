import * as React from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

const C = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export default function Touchable( props ){
  let {children, ...others } = props;

  let child = children;
  if( C === TouchableNativeFeedback && child.length && child.length > 1 ){
    child = (
      <View>
        { child }
      </View>
    );
  }

  return (
    <C { ...others}>
      { child }
    </C>
  )
}