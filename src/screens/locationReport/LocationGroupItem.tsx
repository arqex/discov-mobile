import * as React from 'react'
import { Text, View } from 'react-native'
import { BgLocation } from '../../location/location.service'

enum LocationGroupType {
  'STALE', 'MOVING', 'ACTIVE', 'CLOSE_TO_DISCOVERY'
}

interface LocationGroup {
  id: string
  sentCount: number,
  type: LocationGroupType,
  discoveryId?: string,
  locations: BgLocation[]
}

interface LocationGroupProps {
  group: LocationGroup
}

export default class LocationGroupItem extends React.Component<LocationGroupProps> {
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}