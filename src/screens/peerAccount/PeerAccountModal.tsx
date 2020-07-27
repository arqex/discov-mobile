import React, { Component } from 'react';
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
		this.props.router.back();
	}
}