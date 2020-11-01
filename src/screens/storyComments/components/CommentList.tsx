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
        contentOffset={{x: 0, y: 4000}}
        onLayout={ this._checkInitialScroll }
        ref={ this.scroll }
        data={ comments.items }
        renderItem={ this._renderItem }
        keyExtractor={ this._keyExtractor }
        onScroll={ this._onScroll }
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

  initiallyScrolled = false;
	_checkInitialScroll = () => {
		if( !this.initiallyScrolled && this.scroll.current ){
			this.initiallyScrolled = true;
			setTimeout( () => this.scrollToEnd(), 200 );
		}
  }

  scrollToEnd() {
		console.log('Scrolling!');
		this.scroll.current.scrollToEnd();
  }
  
  _onScroll = e => {
		let verticalScroll = e.nativeEvent.contentOffset.y;
		if( this.initiallyScrolled && verticalScroll < 100 ){
			let comments = this.props.data;
			if( comments.hasMore ){
				this.props.onLoadMore();
			}
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