import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, CounterBadge, styleVars } from '../../components'
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityAlertLevel, ActivityAlertsMeta } from '../../services';

interface ActivityEventsButtonProps {
	drawer: any,
	alerts: ActivityAlertsMeta
}

const alertColors = {
	[ActivityAlertLevel.INFO]: 'blue',
	[ActivityAlertLevel.WARNING]: 'yellow',
	[ActivityAlertLevel.ERROR]: styleVars.colors.primary
}
export default class ActivityEventsButton extends Component<ActivityEventsButtonProps> {
	render() {
		return (
			<View style={styles.container}>
				{ this.renderAlertBadge() }
				{ this.renderUnseenActivityCount() }
				<Button type="icon"
					icon="notifications"
					color="secondary"
					onPress={this.props.drawer.close}
					link="/activityEvents" />
			</View>
		)
	}

	renderAlertBadge(){
		if( !this.props.alerts.count ) return;

		return (
			<View style={styles.notifBadge}>
				<MaterialIcons
					size={19}
					color={ alertColors[this.props.alerts.maxLevel] }
					name="new-releases" />
			</View>
		)
	}

	renderUnseenActivityCount() {
		return;
		
		return (
			<View style={styles.activityCount}>
				<View style={styles.activityCountWrapper}>
					<Text style={styles.activityCountText}>
						2
					</Text>
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		position: 'relative'
	},
	notifBadge: {
		position: 'absolute',
		top: 0, right: 0
	},
	activityCount:{
		position: 'absolute',
		bottom: 0, right: 2,
		backgroundColor: styleVars.colors.primary,
		paddingLeft: 3, paddingRight: 3,
		minWidth: 15, height: 15,
		borderRadius: 8,
		textAlign: 'center',
		alignItems: 'center'
	},
	activityCountWrapper: {
		transform: [{translateY: -1}]
	},
	activityCountText:{
		color: 'white',
		fontWeight: 'bold',
		fontSize: 12
	}
});