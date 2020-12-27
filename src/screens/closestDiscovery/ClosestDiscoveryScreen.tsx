import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Bg, Button } from '../../components'
import LocationService from '../../location/location.service'
import { ScreenProps } from '../../utils/ScreenProps'
import ClosestDiscoveryCard from './ClosestDiscoveryCard'
import ClosestDiscoveryMap from './ClosestDiscoveryMap'

export default class ClosestDiscoveryScreen extends React.Component<ScreenProps> {
  render() {
    let fence = LocationService.getFence();

    return (
      <Bg>
        <View style={styles.container}>
          { this.renderMapBar() }
          <ClosestDiscoveryMap
            fence={ fence }
            position={ LocationService.getLastLocation() } />
          <ClosestDiscoveryCard
            permissions={ LocationService.getStoredPermissions() }
            fence={ fence } />
        </View>
      </Bg>
    )
  }

	renderMapBar() {
		return (
			<View style={styles.mapBar}>
				<Button type="iconFilled"
					icon="arrow-back"
					color="white"
					onPress={ () => this.props.router.back() }
					withShadow />
			</View>
		);
  }

  componentDidMount() {
    LocationService.startTracking();
  }

  componentWillUnmount() {
    LocationService.stopTracking();
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white'
  },
	mapBar: {
    position: 'absolute',
		marginLeft: 20,
		marginRight: 20
  }
})
