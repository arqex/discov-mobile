import { GenericProvider } from './GenericProvider';
import { dataService } from '../services/data.service';

export default function AccountProvider( WrappedComponent ){
	return GenericProvider( WrappedComponent, {
		getId: props => props.accountId,
		getPropName: () => 'account',
		getData: (props, id) => {
			return dataService.getStore().peerAccounts[id]
		},
		loadData: (props, id) => dataService.getActions().account.load(id),
		needsLoad: function (props) { 
			return !this.getData(props, this.getId(props))
		},
		renderLoading: WrappedComponent.renderLoading
	})
};