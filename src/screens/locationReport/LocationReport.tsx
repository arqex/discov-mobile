import * as React from 'react'
import { Dimensions, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import MapView from 'react-native-maps'
import { Bg, TopBar } from '../../components'
import { ScreenProps } from '../../utils/ScreenProps'
import LocationGroup from './LocationGroupItem'

export default class LocationReport extends React.Component<ScreenProps> {
  render() {
    return (
      <Bg>
        <TopBar
          title="Location report"
          subtitle="Next discovery < 300m"
          onBack={ () => this.props.router.back() }
          withSafeArea />
        <View style={{height: Dimensions.get('window').height / 3}}>
          <MapView style={{flex: 1}} />
        </View>
        <View>
          <FlatList
            data={ this.getGroups() }
            renderItem={ this._renderGroup }
            keyExtractor={ this._keyExtractor } />
        </View>
      </Bg>
    )
  }

  getGroups() { 
    return [];
  }

  _renderGroup = group => {
    return (
      <LocationGroup group={ group } />
    )
  }

  _keyExtractor = group => group.id
}