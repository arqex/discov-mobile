import { GenericProvider } from './GenericProvider';
import { dataService } from '../services/data.service';

export default function PeopleProvider(WrappedComponent) {
	return GenericProvider(WrappedComponent, {
		getId: props => props.storyId,
		getPropName: () => 'story',
		getData: (props, id) => {
			return dataService.getStore().stories[id]
		},
		loadData: (props, id) => {
			return dataService.getActions().story.load(id)
		},
		needsLoad: function (props) { return !this.getData(props, this.getId(props)) },
		renderLoading: WrappedComponent.renderLoading
	})
};