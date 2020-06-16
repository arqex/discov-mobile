import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg } from '../../components';

export default class Account extends Component<ScreenProps> {
	render() {
		return (
			<Bg>
				<Text>Account</Text>
			</Bg>
		)
	}
}

const styles = StyleSheet.create({
	container: {

	}
});
