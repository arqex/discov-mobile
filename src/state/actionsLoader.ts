import authActions from './actions/authActions';
import accountActions from './actions/accountActions';
import userActions from './actions/userActions';
import storyActions from './actions/storyActions';
import discoveryActions from './actions/discoveryActions';
import relationshipActions from './actions/relationshipActions';
import followerGroupActions from './actions/followerGroupActions';
import mapActions from './actions/mapActions';
import storyCommentActions from './actions/storyCommentActions';
import activityActions from './actions/activityActions';

let actionNames = {
  auth: authActions,
  account: accountActions,
  accountActivity: activityActions,
  discovery: discoveryActions,
  followerGroup: followerGroupActions,
  map: mapActions,
  relationship: relationshipActions,
  user: userActions,
  story: storyActions,
  storyComment: storyCommentActions
}

export default function actionLoader( store, apiClient ){
  let actions = {}

  Object.keys( actionNames ).forEach( ac => {
    actions[ac] = actionNames[ac]( store, apiClient, actions );
  });

  return actions;
}