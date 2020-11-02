import * as React from 'react';
import { Text, LoadingText } from '../../../components';
import AccountProvider from '../../../providers/AccountProvider';

class CommentOwner extends React.Component {
  render() {
    return (
      <Text type="bold">
        { this.props.account.displayName}
      </Text>
    );
  }
  static renderLoading(props) {
    return (
      <LoadingText type="bold">
        Name Placeholder
      </LoadingText>
    );
  }
}

export default AccountProvider( CommentOwner );