import * as React from 'react';
import { Text, LoadingText } from '../../../components';
import accountLoader from '../../../state/loaders/accountLoader';

interface CommentOwnerProps {
  accountId: string
}
export default class CommentOwner extends React.Component<CommentOwnerProps> {
  render() {
    let account = accountLoader.getData( this, this.props.accountId );
    if( account.isLoading ){
      return this.renderLoading();
    }

    return (
      <Text type="bold">
        { account.data.displayName}
      </Text>
    );
  }

  renderLoading() {
    return (
      <LoadingText type="bold">
        Name Placeholder
      </LoadingText>
    );
  }
}