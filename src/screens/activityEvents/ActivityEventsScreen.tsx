import React, { Component } from 'react'
import { View, Animated } from 'react-native'
import { Bg, ScrollScreen, Text, Tooltip, TopBar, Wrapper } from '../../components'
import services, { ActivityAlert } from '../../services';
import { ScreenProps } from '../../utils/ScreenProps';
import toaster from '../../utils/toaster';
import ActivityAlertItem from './ActivityAlertItem';
import activityTypes from './activityTypes';

export default class ActivityEventsScreen extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)
	state = {
		loading: false
	}
	render() {
		return (
			<Bg>
				<ScrollScreen
					animatedScrollValue={this.animatedScrollValue}
					topBar={this.renderTopBar()}
					header={this.renderHeader()}
					data={ this.getItems() }
					keyExtractor={ item => item.id }
					onRefresh={ this._onRefresh }
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
			...this.getActivityItems()
		];
	}

	getAlerts(){
		return Object.values( services.alert.getAlerts() );
	}

	getActivityItems(){
		let activities = this.getActivities();
		if( !activities || !activities.length ){
			return [ {
				id: 'noactivity',
				tooltip: 'There is no activity yet. Start following your friends and placing stories and you will see their interactions here.'
			} ];
		}

		return activities;
	}

	getActivities(){
		return this.props.actions.accountActivity.getStored();
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
		let Component = activityTypes[ activity.type ];
		return (
			<Component activity={ activity } />
		);
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	needToLoad() {
		return !this.getActivities().length;
	}

	loadActivities() {
		this.setState({loading: true});
		return this.props.actions.accountActivity.loadAccountActivities()
			.then( () => this.setState({loading: false}))
		;
	}

	_onRefresh = () => {
		if( !this.props.isConnected ){
			toaster.show('No internet connection');
			return Promise.resolve();
		}
		else {
			return this.loadActivities()
		}
	}

	componentDidMount(){
		if( this.needToLoad() ) {
			this.loadActivities();
		}
	}
	componentDidUpdate( prevProps ) {
		if( !prevProps.isConnected && this.props.isConnected && this.needToLoad() ){
			this.loadActivities();
		}
	}




}