import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import { styleVars, Text } from '../../../components';
import StoryCommentProvider from '../../../providers/StoryCommentProvider';
import AccountAvatar from '../../components/AccountAvatar';
import CommentOwner from './CommentOwner';
import moment from 'moment';

interface CommentProps {
  commentId: string,
  comment: StoryComment,
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
    const comment = this.props.comment;
    
    return (
      <View style={styles.avatar}>
        <AccountAvatar
          size={ AVATAR_SIZE }
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
        <Text type="subtitle"> - </Text>
        <Text type="subtitle">{ this.getDate() }</Text>
      </View>
    );
  }
  
  renderUserName( isCurrentUser ){
    if( isCurrentUser ){
      return <Text>Me</Text>;
    }

    return <CommentOwner accountId={ this.props.comment.commenterId } />;
  }

  getDate(){
    const { comment } = this.props;
    const date = moment(comment.createdAt);
    const now = new Date();
    if( date.isSame( now, 'day') ){
      return date.format('HH:mm');
    }
    else if ( date.clone().add(1, 'day').isSame( now, 'day') ){
      return 'yesterday';
    }
    else if( date.isSame( now, 'year') ){
      return date.format( 'MM MMM' );
    }
    else {
      return date.format( "MMMM 'YY" );
    }
  }

  renderBubble() {
    const isCurrentUser  = this.isCurrentUser();
    const comment = this.props.comment;
    const bubbleStyle = [
      styles.bubble,
      isCurrentUser && styles.currentUserBubble
    ];
    
    return (
      <View style={ bubbleStyle }>
        <Text>{ comment.content.text }</Text>
      </View>
    )
  }

  isCurrentUser() {
    return this.props.comment.commenterId === this.props.currentUserId;
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
    marginStart: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  currentUserMeta: {
    marginEnd: 4,
    flexDirection: 'row-reverse'
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
