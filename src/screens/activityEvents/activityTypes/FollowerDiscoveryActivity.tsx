import React, { Component } from 'react'
import { Text } from '../../../components';
import ActivityItem from './ActivityItem'

interface FollowerDiscoveryActivityProps {
  account?: PeerAccount
  story?: Story
}
export default class FollowerDiscoveryActivity extends Component<FollowerDiscoveryActivityProps> {
  state = {
    loading: true
  }

  render() {
    let { account, story } = this.props;

    return (
      <ActivityItem
        loading={ this.state.loading}
        relatedAccount={ account }>
        <Text>
          <Text type="bold">{ account?.displayName }</Text> has discovered your story at { story?.aggregated.place?.name }.
        </Text>
      </ActivityItem>
    )
  }
}