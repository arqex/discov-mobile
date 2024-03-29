import React, { Component } from 'react'
import { Text } from '../../../components';
import accountLoader from '../../../state/loaders/accountLoader';
import storyLoader from '../../../state/loaders/storyLoader';
import ActivityItem, {ActivityTypeProps} from './ActivityItem'

export default class FollowerDiscoveryActivity extends Component<ActivityTypeProps> {
  render() {
    let { activity, isFirst, isLast } = this.props;
    let story = storyLoader.getData( this, activity.extra.storyId );
    let account = accountLoader.getData( this, activity.extra.discovererId );

    return (
      <ActivityItem
        isFirst={ isFirst }
        isLast={ isLast }
        loading={ this.isLoading( story, account ) }
        relatedAccount={ account.data }
        action={`/myStories/${activity.extra.storyId}`}
        router={ this.props.router }>
        <Text>
          <Text type="bold">{ account.data?.displayName }</Text> has discovered your story at <Text type="bold">{ story.data?.aggregated.place?.name }</Text>.
        </Text>
      </ActivityItem>
    )
  }

  isLoading( story, account ){
    return story.isLoading || account.isLoading;
  }
}