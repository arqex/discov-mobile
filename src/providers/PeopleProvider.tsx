import { GenericProvider } from './GenericProvider';
import { dataService } from '../services/data.service';

export default function PeopleProvider(WrappedComponent) {
	return GenericProvider(WrappedComponent, {
		getId: props => props.peopleId,
		getData: (props, id) => dataService.getStore()[isAccount(id) ? 'accounts' : 'followerGroups'][id],
		loadData: (props, id) => dataService.getActions()[isAccount(id) ? 'account' : 'followerGroup'].load(id),
		needsLoad: function (props) { return !this.getData(props, this.getId(props)) },
		renderLoading: WrappedComponent.renderLoading
	})
};

function isAccount(peopleId) {
	return peopleId && peopleId.endsWith('ac');
}
