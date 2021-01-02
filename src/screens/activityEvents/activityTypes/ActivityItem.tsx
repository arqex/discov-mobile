import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class ActivityItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> textInComponent </Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
})