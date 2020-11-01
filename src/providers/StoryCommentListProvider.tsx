import {GenericProvider} from './GenericProvider';
import { dataService } from '../services/data.service';

export default function StoryCommentListProvider( WrappedComponent ){
  return GenericProvider( WrappedComponent, {
    getId: props => props.storyId,
    getData: (props, id) => dataService.getStore().storyComments[ id ],
    loadData: (props, id) => {
      return dataService.getActions().storyComment.loadStoryComments( id )
    },
    needsLoad: function(props) { return !this.getData( props, this.getId(props) ) },
    renderLoading: WrappedComponent.renderLoading
  });
}
