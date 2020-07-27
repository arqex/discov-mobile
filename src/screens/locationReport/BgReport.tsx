import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Wrapper } from '../../components';

export default class LocationReport extends Component<ScreenProps> {
	render() {
		let store = this.props.store;
		let logs = store && store.logList || [];

		return (
			<Wrapper padding="40 10">
				<Text>Logs</Text>
				<ScrollView contentContainerStyle={styles.container}>
					{ logs.map(this._renderLog) }
				</ScrollView>
			</Wrapper>
		);
	}

	_renderLog = line => {
		return (
			<View style={styles.line}>
				<Text>{this.renderDate(line.time)}</Text>
				<Text style={styles.type}>{line.type}</Text>
				{ this.renderItems(line.items) }
			</View>
		);
	}

	renderDate( t ){
		let d = new Date(t);
		return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	}

	renderItems( items ){
		return (
			<View style={ styles.items }>
				{ items.map( it => <Text style={styles.item}>{it}</Text> ) }
			</View>
		);
	}
}

function pad( n ){
	if( n < 10 ){
		return `0${n}`;
	}
	return n;
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
	},
	type: {
		marginLeft: 5
	},
	items: {
		flexGrow: 1,
		marginLeft: 5
	},
	item: {
		marginBottom: 2
	}
});