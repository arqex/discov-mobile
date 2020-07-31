import React, { Component } from 'react';
import { store, actions } from '../state/appState';
import storeService from '../state/store.service';

// Loads the story and its owner from the store or the api
export default function AccountProvider(WrappedComponent) {
	return class extends React.Component<any> {
		account: any = false
		accountListener: any = false

		constructor(props) {
			super(props);

			if( !props.accountId ){
				console.error('Account provider called without a accountId');
			}

			this.loadAccount(props.accountId);
		}

		render() {
			return (
				<WrappedComponent
					account={ storeService.getAccount(this.props.accountId) }
					{...this.props} />
			);
		}

		loadAccount(accountId) {
			this.account = storeService.getAccount(accountId);

			if (!this.account) {
				actions.account.load(accountId)
					.then(() => {
						// Story should be in the store now, load it
						this.loadAccount(accountId);
						this.checkListeners();
						this.forceUpdate();
					})
				;
			}
		}

		componentDidMount() {
			this.checkListeners();
		}

		_onChange = () => {
			// check the changes in the account
			this.loadAccount(this.props.accountId);
			this.forceUpdate();
		}

		checkListeners() {
			if (this.account && !this.accountListener) {
				this.accountListener = true;
				this.account.on('state', this._onChange);
			}
		}

		componentDidUpdate(prevProps) {
			if (this.props.accountId !== prevProps.accountId) {
				this.account.off('state', this._onChange);
				this.accountListener = false;
				this.loadAccount(this.props.accountId);
			}
		}

		componentWillUnmount() {
			if (this.accountListener) {
				this.account.off('state', this._onChange);
			}
		}
	}
}