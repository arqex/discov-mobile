import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { Bg, ScrollScreen, Text, TopBar } from '../../components'
import services, { ActivityAlert } from '../../services';
import { ScreenProps } from '../../utils/ScreenProps';
import ActivityAlertItem from './ActivityAlertItem';

export default class ActivityEventsScreen extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	render() {
		return (
			<Bg>
				<ScrollScreen
					animatedScrollValue={this.animatedScrollValue}
					topBar={this.renderTopBar()}
					header={this.renderHeader()}>
					<View>
						{ this.renderAlerts() }
						<Text> textInComponent </Text>
					</View>
					</ScrollScreen>
			</Bg>
		)
	}

	renderHeader() {
		return <Text type="header">Activity</Text>;
	}

	renderTopBar() {
		return (
			<TopBar title="Activity"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}

	renderAlerts(){
		let alerts: ActivityAlert[] = Object.values( services.alert.getAlerts() );
		if( !alerts.length ) return;

		return (
			<View>
				{ alerts.map( this._renderAlert ) }
			</View>
		)
	}

	_renderAlert = alert => {
		return (
			<ActivityAlertItem
				key={alert.id}
				alert={alert} />
		);
	}
}