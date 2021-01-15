import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import { styleVars, Text } from '../../../components';
import AccountAvatar from '../../components/AccountAvatar';
import CommentOwner from './CommentOwner';
import moment from 'moment';

interface CommentProps {
  comment?: StoryComment,
  currentUserId: string,
  isStoryOwner: boolean
}

const AVATAR_SIZE = 40;
const MARGIN = 20;

export default class CommentItem extends React.Component<CommentProps> {
  render() {
    let { comment } = this.props;
    if( !comment ) return null;

    const isCurrentUser = this.isCurrentUser();

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
    return (
      <View style={styles.avatar}>
        <AccountAvatar
          size={ AVATAR_SIZE }
          accountId={this.getComment().commenterId}
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
      return <Text type="bold">Me</Text>;
    }

    return <CommentOwner accountId={ this.getComment().commenterId } />;
  }

  getComment(): StoryComment {
    return this.props.comment;
  }

  getDate(){
    const comment = this.getComment();
    const date = moment(comment.createdAt);
    const now = new Date();
    if( date.isSame( now, 'day') ){
      return date.format('HH:mm');
    }
    else if ( date.clone().add(1, 'day').isSame( now, 'day') ){
      return 'Yesterday';
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
    const comment = this.getComment();
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
    return this.getComment().commenterId === this.props.currentUserId;
  }
};

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
    paddingTop: 4,
    paddingBottom: 5,
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
