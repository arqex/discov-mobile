import * as React from 'react';
import { Text } from 'react-native';
import AccountProvider from '../../../providers/AccountProvider';

function CommentOwner( props ){
  if( !props.account ) return null;

  return (
    <Text>{ props.account.displayName }</Text>
  ); 
}

export default AccountProvider( CommentOwner );