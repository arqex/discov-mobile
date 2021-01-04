import React, { Component } from 'react'
import { Text } from '../../../components';
import accountLoader from '../../../state/loaders/accountLoader';
import storyLoader from '../../../state/loaders/storyLoader';
import ActivityItem from './ActivityItem'

interface FollowerDiscoveryActivityProps {
  accountId: string
  storyId: string
}
export default class FollowerDiscoveryActivity extends Component<FollowerDiscoveryActivityProps> {
  render() {
    let { accountId, storyId } = this.props;
    let story = storyLoader.getData( storyId );
    let account = accountLoader.getData( accountId );

    return (
      <ActivityItem
        loading={ this.isLoading( story, account ) }
        relatedAccount={ account }>
        <Text>
          <Text type="bold">{ account?.displayName }</Text> has discovered your story at { story?.aggregated.place?.name }.
        </Text>
      </ActivityItem>
    )
  }

  isLoading( story, account ){
    return story.isLoading || account.isLoading;
  }
}