import React, { Component } from 'react'
import { Text } from '../../../components';
import accountLoader from '../../../state/loaders/accountLoader';
import ActivityItem, {ActivityTypeProps} from './ActivityItem'

export default class NewFollowerActivity extends Component<ActivityTypeProps> {
  render() {
    let { activity, isFirst, isLast } = this.props;
    let account = accountLoader.getData( this, activity.extra.followerId );

    return (
      <ActivityItem
        isFirst={ isFirst }
        isLast={ isLast }
        loading={ account.isLoading }
        relatedAccount={ account.data }
        action={`/accountModal?accountId=${activity.extra.followerId}`}
        router={ this.props.router }>
        <Text>
          <Text type="bold">{ account.data?.displayName }</Text> has started to follow you.
        </Text>
      </ActivityItem>
    )
  }

  isLoading( story, account ){
    return story.isLoading || account.isLoading;
  }
}