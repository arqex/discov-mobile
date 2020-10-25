import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '../../components';


interface StoryCommentsButtonProps {
	story: any,
	onPress: () => any
}

const StoryCommentsButton = ({story, onPress}: StoryCommentsButtonProps) => {
	return (
		<Button type="transparent"
			color="secondary"
			icon="chat-bubble-outline"
			iconColor="#666"
			iconPosition="post"
			onPress={ onPress }
			size="s">
			{ story.aggregated.commentsCount || '' }
		</Button>
	);
};

export default StoryCommentsButton;

const styles = StyleSheet.create({
	container: {}
});
