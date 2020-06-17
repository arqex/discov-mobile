import React, { Component } from 'react';
import { Keyboard, View, TextInput, StyleSheet, Alert } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import {TopBar, Button } from '../../components';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';

interface AddStoryContentState {
	content: string,
	selection: any,
	emojiKeyboard: boolean
}

export default class AddStoryContent extends Component<ScreenProps, AddStoryContentState> {
	constructor(props) {
		super(props)
		
		let story = this.getStory();
		this.state = {
			content: story.content,
			selection: { start: 0, end: 0 },
			emojiKeyboard: false
		};
	}

	input = React.createRef()

	render() {
		let extraPadding = { paddingBottom: getNavigationBarHeight() || 10 };

		return (
			<View style={styles.container}>
				<TopBar onBack={ this._onBack }
					withSafeArea
					showBorder={ false }
					title={ __('createStory.writeTitle') }
				/>
				<View style={styles.textInputWrapper }>
					<TextInput multiline style={styles.textInput}
						ref={ this.input }
						onChangeText={ content => this.setState({content}) }
						value={ this.state.content } />
				</View>
				<View style={[styles.bottomBar, extraPadding]}>
					<Button size="s" onPress={ this._onContentOk }>{ __('ok') }</Button>
				</View>
			</View>
		)
	}

	focusInput() {
		this.input.current && this.input.current.focus();
	}


	_onContentOk = () => {
		if( !this.state.content ){
			return Alert.alert('Create story', 'You need to write something for your story');
		}

		let story = this.getStory();

		story.content = this.state.content;

		this.props.router.navigate('/createStory/addContent/share');
	}

	_onSelection = e => {
		this.setState({ selection: e.nativeEvent.selection })
	}

	_onKeyboardAppear = () => {
		if (this.state.emojiKeyboard) {
			this.setState({ emojiKeyboard: false });
		}
	}

	_onBack = () => {
		this.props.router.navigate('/createStory');
	}

	componentDidMount() {
		Keyboard.addListener('keyboardWillShow', this._onKeyboardAppear );
	}

	// Thanks to react-urlstack we have this method to know
	// when the component is going to be shown
	componentWillEnter() {
		setTimeout(() => {
			this.focusInput();
		}, 300);
	}

	componentWillLeave() {
		Keyboard.dismiss();
	}

	getStory() {
		return this.props.store.storyInProgress;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},

	textInputWrapper: {
		flex: 1,
		alignItems: 'flex-start',
		paddingLeft: 20,
		paddingRight: 20
	},
	textInput: {
		flex: 1,
		fontSize: 15,
		textAlignVertical: 'top'
	},
	bottomBar: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
	},
	emojiWrapper: {
		paddingTop: 8,
		flex: 1,
		borderTopColor: '#eee',
		borderTopWidth: 1
	}
});