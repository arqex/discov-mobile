import React, { Component } from 'react'
import { View } from 'react-native'
import { Text } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import FgLocationScreen from './FgLocationScreen'

export default class FgLocationModal extends Component<ScreenProps> {
  render() {
    return (
      <FgLocationScreen
        {...this.props}
        onFinish={ () => this.props.router.back() }
        showSkip>
          <View>
            <Text>To start discovering your friend's stories when you are close to them, Discov needs access to your location.</Text>
          </View>
      </FgLocationScreen>
    );
  }
}