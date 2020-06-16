import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import PeerAccount from './PeerAccount';

export default class PeerAccountModal extends Component<ScreenProps> {

	render() {
		let accountId = this.props.location.query.accountId;

		return (	
			<PeerAccount
				accountId={ accountId }
				onBackPress={ this._onBackPress }
				{ ...this.props } />
		);
	}

	_onBackPress = () => {
		let stack = this.props.router.stack;
		let lastRoute = stack[stack.length - 1].path;

		this.props.router.navigate( lastRoute );
	}
}