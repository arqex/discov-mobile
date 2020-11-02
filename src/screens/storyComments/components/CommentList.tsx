import * as React from 'react';
import { ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import { Tooltip } from '../../../components';
import StoryCommentListProvider from '../../../providers/StoryCommentListProvider';
import Comment from './Comment';

interface CommentListProps {
  currentUserId: string,
  isStoryOwner: boolean,
  isLoadingMore: boolean,
  storyId: string,
  story: any,
  data: any,
  onLoadMore: () => any
}

class CommentList extends React.Component<CommentListProps> {
  scroll = React.createRef<FlatList<any>>();
  
  render() {
    let comments = this.props.data;

    return (
      <FlatList
        contentOffset={{x: 0, y: 10000}}
        onLayout={ this._onLayout }
        ref={ this.scroll }
        data={ comments.items }
        renderItem={ this._renderItem }
        keyExtractor={ this._keyExtractor }
        onScroll={ this._onScroll }
        onContentSizeChange={ this._onContentSizeChange }
        scrollEventThrottle={ 100 }
        ListHeaderComponent={ this.renderHeader(comments) } />
    );
  }

  renderHeader( comments) {
		if( !comments.items.length ){
			return (
				<View style={styles.header}>
					<Tooltip style={{ maxWidth: 300 }}>
						There are no comments yet. Be the first in leaving one.
				</Tooltip>
				</View>
			)
		}

		if( !comments.hasMore ){
			return (
				<View style={styles.header}>
					<Tooltip style={{ maxWidth: 300 }}>
						This is the begining of the conversation.
					</Tooltip>
				</View>
			);
		}

		if( this.props.isLoadingMore ){
			return (
				<View style={styles.header}>
          <ActivityIndicator />
        </View>
      );
		}
  }

  _renderItem = ({item}) => {
		return (
			<Comment
				commentId={ item }
				currentUserId={ this.props.currentUserId }
				isStoryOwner={ this.props.isStoryOwner }
			/>
		);
  }
  
  _keyExtractor = item => item;

  lastHeight = 0;
	_onLayout = (e) => {
    this.checkInitialScroll();
    let height = e.nativeEvent.layout.height;
    this.relativeScroll( this.lastHeight - height, true );
    this.lastHeight = height;
    console.log( 'height', height );
  }

  initiallyScrolled = false;
  checkInitialScroll() {
    if( !this.initiallyScrolled && this.scroll.current ){
			this.initiallyScrolled = true;
			setTimeout( () => this.scrollToEnd(), 200 );
		}
  }

  scrollToEnd() {
		console.log('Scrolling!');
		this.scroll.current.scrollToEnd();
  }

  relativeScroll( diff, animated ){
    if( diff > 0 ){
      console.log( 'Relative scroll', diff, this.lastScroll + diff );
      this.scroll.current.scrollToOffset({
        offset:this.lastScroll + diff,
        animated: animated
      });
    }
  }
  
  _onScroll = e => {
    // console.log( 'Scrolling', e.nativeEvent.contentOffset.y );
    this.checkLoadMore( e.nativeEvent.contentOffset.y );
    this.checkStickToBottom( e.nativeEvent.contentOffset.y );
    if( this.blockedByScroll && !this.props.isLoadingMore ){
      this.blockedByScroll = false;
      this.forceUpdate();
    }
  }

  _onMomentumScrollEnd = e => {
    // console.log( 'Finished scrolling', e.nativeEvent.contentOffset.y );
    this.checkLoadMore( e.nativeEvent.contentOffset.y );
    this.checkStickToBottom( e.nativeEvent.contentOffset.y );
  }

  contentSize = 0;
  _onContentSizeChange = (width, height) => {
    // console.log( 'Content size change', height );
    if( this.contentSize ){
      // this.relativeScroll( height - this.contentSize, false );
    }
    this.contentSize = height;
  }

  checkLoadMore( scrollOffset ){
    if( this.initiallyScrolled && scrollOffset < 100 ){
			let comments = this.props.data;
			if( comments.hasMore ){
				this.props.onLoadMore();
			}
		}
  }

  lastScroll = 0;
  checkStickToBottom( scrollOffset ){
    // console.log('Sticking?', scrollOffset, this.lastHeight);
    this.lastScroll = scrollOffset;
  }

  lastId;
  componentDidMount() {
    this.lastId = this.getLastCommentId();
  }
  componentDidUpdate() {
    if( this.lastId !== this.getLastCommentId() ){
      this.lastId = this.getLastCommentId();
      setTimeout( () => this.scrollToEnd(), 100 );
    }
  }
  getLastCommentId() {
    let { items } = this.props.data;
    return items[ items.length - 1 ];
  }

  blockedByScroll = true;
  shouldComponentUpdate( nextProps ){
    let blocked = this.blockedByScroll;
    if( nextProps.isLoadingMore ){
      this.blockedByScroll = true;
    }
    return !blocked;
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center'
  }
})

export default StoryCommentListProvider( CommentList );