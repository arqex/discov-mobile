import React, { Component } from 'react';
import { ScreenProps } from '../../utils/ScreenProps';
import PeerAccount from './PeerAccount';

export default class PeerAccountScreen extends Component<ScreenProps> {

	render() {
		let accountId = this.props.location.params.id;

		return (
			<PeerAccount
				accountId={accountId}
				onBackPress={this._onBackPress}
				{...this.props} />
		);
	}

	_onBackPress = () => {
		return this.props.router.back();
	}
}