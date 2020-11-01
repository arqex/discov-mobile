import * as React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { styleVars } from '../../../components';
import StoryCommentProvider from '../../../providers/StoryCommentProvider';
import AccountAvatar from '../../components/AccountAvatar';
import CommentOwner from './CommentOwner';

interface CommentProps {
  commentId: string,
  data: any,
  currentUserId: string,
  isStoryOwner: boolean,
  storeService: any,
  actions: any
}

const AVATAR_SIZE = 40;
const MARGIN = 20;

class Comment extends React.Component<CommentProps> {
  render() {
    let isCurrentUser = this.isCurrentUser();

    let containerStyle = [
      styles.container,
      isCurrentUser && styles.currentUserContainer
    ];

    let commentStyle = [
      styles.comment,
      isCurrentUser && styles.currentUserComment
    ];

    return (
      <View style={ containerStyle }>
        { this.renderAvatar() }
        <View style={ commentStyle }>
          {this.renderMeta()}
          {this.renderBubble()}
        </View>
      </View>
    );
  }

  renderAvatar() {
    const comment = this.props.data;
    
    return (
      <View style={styles.avatar}>
        <AccountAvatar size={ AVATAR_SIZE }
          accountId={comment.commenterId}
          border={2}
          borderColor="blue" />
      </View>
    );
  }

  renderMeta() {
    const isCurrentUser  = this.isCurrentUser();

    let metaStyles = [
      styles.meta,
      isCurrentUser && styles.currentUserMeta
    ];

    return (
      <View style={ metaStyles }>
        { this.renderUserName( isCurrentUser ) }
      </View>
    );
  }
  
  renderUserName( isCurrentUser ){
    if( isCurrentUser ){
      return <Text>Me</Text>;
    }

    return <CommentOwner accountId={ this.props.data.commenterId } />;
  }

  renderBubble() {
    const isCurrentUser  = this.isCurrentUser();
    const comment = this.props.data;
    const bubbleStyle = [
      styles.bubble,
      isCurrentUser && styles.currentUserBubble
    ];
    
    return (
      <View style={ bubbleStyle }>
        <Text>{ comment.content.text } </Text>
      </View>
    )
  }

  isCurrentUser() {
    return this.props.data.commenterId === this.props.currentUserId;
  }
};

export default StoryCommentProvider( Comment );

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    paddingStart: 20,
    paddingEnd: 40,
    marginBottom: 8
  },
  currentUserContainer: {
    flexDirection: 'row-reverse'
  },

  currentUserComment: {
    alignItems: 'flex-end'
  },

  avatar: {
    
  },
  meta: {
    marginTop: 4,
    marginStart: 4
  },
  currentUserMeta: {
    marginEnd: 4
  },
  bubble: {
    backgroundColor: 'white',
    marginStart: -10,
    marginEnd: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: styleVars.colors.borderBlue,
    borderTopEndRadius: 4,
    borderBottomEndRadius: 4,
    borderBottomStartRadius: 4
  },
  currentUserBubble: {
    marginStart: 30,
    marginEnd: -10,
    borderTopStartRadius: 4,
    borderTopEndRadius: 0
  }
});
