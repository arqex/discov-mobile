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
		let path = this.props.router.location.pathname;
		
		if( path ){
			let pathParts = path.split('/');
			if( pathParts.length > 2 ){
				path = pathParts.slice(0, pathParts.length - 1).join('/');
				return this.props.router.navigate(path);
			}
		}

		this.props.drawer.open();
	}
}