import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Wrapper } from '../../components';
import store from '../../state/store';
import locationHandler from '../../location/location.handler';

export default class LocationReport extends Component<ScreenProps> {
	render() {
		let store = this.props.store;
		let logs = store && store.bgLogs || [];

		return (
			<Wrapper padding="40 10">
				<Text>Background Report</Text>
				<ScrollView contentContainerStyle={styles.container}>
					{logs.map(this._renderLog)}
				</ScrollView>
			</Wrapper>
		);
	}

	_renderLog( line ) {
		return (
			<View style={styles.line}>
				<Text>{ line }</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
		paddingBottom: 50,
		width: '100%',
		alignItems: 'stretch'
	},
	line: {
		flexDirection: 'row',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 5,
		justifyContent: 'space-between'
	}
});