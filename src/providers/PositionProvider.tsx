import React from 'react';
import locationService from '../location/location.service';
import storeService from '../state/store.service';

const EXPIRY_TIME = 5 * 60000;

export default function PositionProvider(WrappedComponent) {

	return class PositionProvider extends React.Component<any> {
		position: any = false
		positionListener: any = false

		state = {
			loading: false,
			positionRequested: false
		}
		
		render() {
			let position = storeService.getCurrentPosition();
			return (
				<WrappedComponent
					position={ position || false }
					{...this.props} />
			);
		}

		getPosition() {
			return storeService.getCurrentPosition();
		}

		componentDidMount() {
			this.position = this.getPosition();
			if( this.needToLoad( this.position ) ){
				this.loadPosition();
			} 
		}


		loadPosition() {
			this.checkListeners();

			this.setState({loading: true, positionRequested: true});
			if( !this.state.positionRequested ){
				locationService.updateLocation( true );
			}
			setTimeout( () => this.setState({loading: false}), 500 );
		}

		needToLoad( position ){
			return !this.state.loading && !position;
		}

		isExpired( position ){
			return position.updatedAt + EXPIRY_TIME < Date.now();
		}

		checkListeners() {
			if (this.position && !this.positionListener) {
				this.positionListener = true;
				this.position.addChangeListener( this._onChange );
			}
		}

		componentWillUnmount() {
			if (this.positionListener) {
				this.position.removeChangeListener( this._onChange );
			}
		}

		_onChange = () => {
			// check the changes in the account
			this.position = storeService.getCurrentPosition();
			this.forceUpdate();
		}
	}
}