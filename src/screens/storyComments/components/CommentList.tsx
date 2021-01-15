import * as React from 'react';
import { ActivityIndicator, FlatList, View, StyleSheet } from 'react-native';
import { Tooltip } from '../../../components';
import CommentItem from './CommentItem';

interface CommentListProps {
  story: Story,
  allComments: { [id: string]: StoryComment},
  commentsPage: DataLoaderResult<DataPage<string>>
  currentUserId: string,
  isStoryOwner: boolean,
  isLoadingMore: boolean,
  onLoadMore: () => any,
  isConnected: boolean
}

export default class CommentList extends React.Component<CommentListProps> {
  scroll = React.createRef<FlatList<any>>();
  
  render() {
    let comments = this.props.commentsPage?.data;

    if( !comments && !this.props.isConnected ){
      return this.renderNoConnection();
    }

    return (
      <FlatList
        inverted
        onEndReached={ this._checkLoadMore }
        onEndReachedThreshold={ .1 }
        data={ comments && comments.items }
        renderItem={ this._renderItem }
        keyExtractor={ this._keyExtractor }
        ListFooterComponent={ this.renderHeader(comments) } />
    );
  }

  renderNoConnection() {
    return (
      <View style={{padding: 20}}>
        <Tooltip>There is no internet connection.</Tooltip>
      </View>
    )
  }

  renderHeader( comments ) {
    if( !comments ) return;

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
			<CommentItem
        comment={ this.props.allComments[item] }
				currentUserId={ this.props.currentUserId }
				isStoryOwner={ this.props.isStoryOwner }
			/>
		);
  }
  
  _keyExtractor = item => item;


  initialized = false;
  _onLayout = () => {
    if( !this.initialized ){
      this.initialized = true;
    }
  }

  _checkLoadMore = () => {
    if( !this.props.isConnected ) return;
    
    if (this.initialized && this.props.data.hasMore && !this.props.isLoadingMore ){
      console.log('loadingMore');
			this.props.onLoadMore();
		}
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center'
  }
});