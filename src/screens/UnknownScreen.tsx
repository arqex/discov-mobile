import React, { Component } from 'react'
import { Text, SafeAreaView } from 'react-native'

export default class  extends Component {
  render() {
    return (
      <SafeAreaView>
        <Text>Sorry, screen not found: { this.props.router.location.pathname } </Text>
      </SafeAreaView>
    )
  }
}
