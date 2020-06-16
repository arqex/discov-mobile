import React 	from 'react';
import { actions } from '../state/appState';
import storeService from '../state/store.service';

// Loads the story and its owner from the store or the api
export default function PeopleProvider(WrappedComponent) {
	return class extends React.Component<any> {
		people: any = false
		peopleListener: any = false

		constructor(props) {
			super(props);

			if( !props.peopleId ){
				console.error('People provider called without a peopleId');
			}

			this.loadPeople(props.peopleId);
		}

		render() {
			return (
				<WrappedComponent
					people={this.people}
					{...this.props} />
			);
		}

		loadPeople( peopleId ) {
			this.people = this.isAccount( peopleId ) ?
				storeService.getAccount( peopleId ) :
				storeService.getFollowerGroup( peopleId )
			;

			if ( !this.people ) {
				let loader = this.isAccount( peopleId ) ?
					actions.account :
					actions.followerGroup
				;

				loader.load( peopleId )
					.then( () => {
						// People should be in the store now, load it
						this.loadPeople( peopleId );
						this.checkListeners();
						this.forceUpdate();
					})
				;
			}
		}

		isAccount( peopleId ){
			return peopleId && peopleId.slice(0,2) === 'ac';
		}

		componentDidMount() {
			this.checkListeners();
		}

		_onChange = () => {
			// check the changes in the account
			this.loadPeople(this.props.peopleId);
			this.forceUpdate();
		}

		checkListeners() {
			if (this.people && !this.peopleListener) {
				this.peopleListener = true;
				this.people.on('state', this._onChange);
			}
		}

		componentDidUpdate(prevProps) {
			if (this.props.peopleId !== prevProps.peopleId) {
				this.people.off('state', this._onChange);
				this.peopleListener = false;
				this.loadPeople(this.props.peopleId);
			}
		}

		componentWillUnmount() {
			if (this.peopleListener) {
				this.people.off('state', this._onChange);
			}
		}
	}
}