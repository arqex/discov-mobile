import * as React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { styleVars } from '../../../components';
import AccountAvatar from '../../components/AccountAvatar';

interface CommentProps {
  comment: any,
  isCurrentUser: boolean,
  isStoryOwner: boolean,
  storeService: any,
  actions: any
}

const AVATAR_SIZE = 40;
const MARGIN = 20;

export default class Comment extends React.Component<CommentProps> {
  render() {
    let containerStyle = [
      styles.container,
      this.props.isCurrentUser && styles.currentUserContainer
    ];

    let commentStyle = [
      styles.comment,
      this.props.isCurrentUser && styles.currentUserComment
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
    const { comment } = this.props;
    
    return (
      <View style={styles.avatar}>
        <AccountAvatar size={ AVATAR_SIZE } accountId={comment.commenterId} />
      </View>
    );
  }

  renderMeta() {
    const { isCurrentUser } = this.props;
    const account = this.getAccount();

    let metaStyles = [
      styles.meta,
      isCurrentUser && styles.currentUserMeta
    ]

    return (
      <View style={ metaStyles }>
        <Text>{ isCurrentUser ? 'Me' : account && account.displayName || ' ' }</Text>
      </View>
    );
  }

  renderBubble() {
    const {comment, isCurrentUser } = this.props;
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

  componentDidMount() {
    this.checkAccountLoad();
  }

  componentDidUpdate() {
    this.checkAccountLoad();
  }

  loadPromise: any = false;
  checkAccountLoad(){
    const {actions, comment, storeService } = this.props;

    let account = this.getAccount();
    if( !account && !this.loadPromise ){
      this.loadPromise = actions.account.load( comment.commenterId )
        .finally( () => {
          this.loadPromise = false;
        })
      ;
    }
  }

  getAccount() {
    const { storeService, comment } = this.props;
    return storeService.getAccount( comment.commenterId );
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
