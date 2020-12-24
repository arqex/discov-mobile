import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { Bg, ScrollScreen, Text, Tooltip, TopBar, Wrapper } from '../../components'
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
					header={this.renderHeader()}
					data={ this.getItems() }
					keyExtractor={ item => item.id }
					renderItem={ this._renderItem } />
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

	getItems(){
		return [
			...this.getAlerts(),
			...this.getActivities()
		];
	}

	getAlerts(){
		return Object.values( services.alert.getAlerts() );
	}

	getActivities(){
		let activities = this.props.store.user.activities;
		if( !activities || !activities.length ){
			return [ {
				id: 'noactivity',
				tooltip: 'There is no activity yet. Start following your friends and placing stories and you will see their interactions here.'
			} ];
		}

		return activities.map( id => this.props.store.accountActivities[id] );
	}

	_renderItem = ( {item} ) => {
		if( item.tooltip ){
			return this.renderTooltip( item.tooltip );
		}
		else if( item.level ){
			return this.renderAlert( item )
		}

		return this.renderActivity( item );
	}

	renderTooltip( text ) {
		return (
			<Wrapper textWidth>
				<Tooltip>
					{ text }
				</Tooltip>
			</Wrapper>
		)
	}

	renderAlert( alert ) {
		return (
			<View style={{marginBottom: 10}}>
				<ActivityAlertItem
					key={alert.id}
					router={this.props.router}
					alert={alert} />
			</View>
		);
	}

	renderActivity( activity ) {
		return (
			<View><Text>Activity render not implemented yet</Text></View>
		)
	}
}