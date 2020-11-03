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
        inverted
        onEndReached={ this._checkLoadMore }
        onEndReachedThreshold={ .1 }
        onLayout={ this._onLayout }
        ref={ this.scroll }
        data={ comments.items }
        renderItem={ this._renderItem }
        keyExtractor={ this._keyExtractor }
        ListFooterComponent={ this.renderHeader(comments) } />
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

  scrollToEnd() {
		console.log('Scrolling!');
		this.scroll.current.scrollToOffset({offset: 0});
  }

  initialized = false;
  _onLayout = () => {
    if( !this.initialized ){
      this.initialized = true;
    }
  }

  _checkLoadMore = () => {
    if (this.initialized && this.props.data.hasMore && !this.props.isLoadingMore ){
      console.log('loadingMore');
			this.props.onLoadMore();
		}
  }

  firstId;
  componentDidMount() {
    this.firstId = this.props.data.items[ 0 ];
  }
  componentDidUpdate() {
    let nextId = this.props.data.items[0];
    if( this.firstId !== nextId ){
      this.firstId = nextId;
      setTimeout( () => this.scrollToEnd(), 100 );
    }
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