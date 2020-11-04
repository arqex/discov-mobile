import { GenericProvider } from './GenericProvider';
import { dataService } from '../services/data.service';

export default function DiscoveryProvider(WrappedComponent) {
	return GenericProvider(WrappedComponent, {
		getId: props => props.discoveryId,
		getPropName: () => 'discovery',
		getData: (props, id) => {
			return dataService.getStore().discoveries[id]
		},
		loadData: (props, id) => {
			return dataService.getActions().discovery.load(id)
		},
		needsLoad: function (props) { return !this.getData(props, this.getId(props)) },
		renderLoading: WrappedComponent.renderLoading
	})
};