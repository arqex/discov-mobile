import {GenericProvider} from './GenericProvider';
import { dataService } from '../services/data.service';

export default function StoryCommentProvider( WrappedComponent ){
  return GenericProvider( WrappedComponent, {
    getId: props => props.commentId,
    getPropName: () => 'comment',
    getData: (props, id) => dataService.getStore().comments[ id ],
    loadData: (props, id) => dataService.getActions().storyComment.loadSingle(id),
    needsLoad: function(props) { return !this.getData( props, this.getId(props) ) },
    renderLoading: WrappedComponent.renderLoading
  });
}
