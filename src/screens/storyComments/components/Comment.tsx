import * as React from 'react';
import { View, Text} from 'react-native';


export default function Comment( {comment, isCurrentUser, isStoryOwner} ){
  console.log( comment );
  return (
    <View>
      <Text>{ comment.content.text }</Text>
    </View>
  );
}