import React from 'react';
import { actions } from '../state/appState';
import storeService from '../state/store.service';

const EXPIRY_TIME = 5 * 60000;

export default function PositionProvider(WrappedComponent) {

	return class PositionProvider extends React.Component<any> {
		position: any = false
		positionListener: any = false

		constructor(props) {
			super(props);
			this.loadPosition();
		}

		render() {
			let position = storeService.getCurrentPosition();
			return (
				<WrappedComponent
					position={ position && position.coords || false }
					{...this.props} />
			);
		}

		loadPosition() {
			this.position = storeService.getCurrentPosition();
			this.checkListeners();

			if ( this.needToLoad( this.position ) ) {
				actions.map.getCurrentPosition()
					.then(() => {
						// Position should be in the store now, load it
						this.position = storeService.getCurrentPosition();
						this.forceUpdate();
					})
				;
			}
		}

		needToLoad( position ){
			if( position.status === 'loading' ){
				return false;
			}

			if( position.status === 'ok' && !this.isExpired( position ) ){
				return false;
			}

			return true;
		}

		isExpired( position ){
			return position.updatedAt + EXPIRY_TIME < Date.now();
		}

		checkListeners() {
			if (this.position && !this.positionListener) {
				this.positionListener = true;
				this.position.on('state', this._onChange);
			}
		}

		componentWillUnmount() {
			if (this.positionListener) {
				this.position.off('state', this._onChange);
			}
		}

		_onChange = () => {
			// check the changes in the account
			this.position = storeService.getCurrentPosition();
			this.forceUpdate();
		}
	}
}