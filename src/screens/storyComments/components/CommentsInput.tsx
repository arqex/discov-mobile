import * as React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Button, styleVars } from '../../../components';
import { getNavigationBarHeight } from '../../../components/utils/getNavigationBarHeight';

interface CommentsInputProps {
	text: string
	onChange: (text:string) => any,
	onSend: () => any,
	isSending: boolean
}

const CommentsInput = ({text, onChange, onSend, isSending}: CommentsInputProps) => {
	let [inputHeight, setInputHeight] = React.useState(19.5);
	let inputWrapperStyles = [
		styles.inputWrapper,
		{ height: Math.min( 120, inputHeight + 20.5 ) }
	];

	console.log( 'height', inputHeight, inputWrapperStyles[1].height );

	return (
		<View style={styles.bottomBar}>
			<View style={inputWrapperStyles}>
				<TextInput style={styles.input}
					value={ text }
					onChangeText={ onChange }
					multiline
					onContentSizeChange={ e => setInputHeight( e.nativeEvent.contentSize.height )}
					placeholder="Write a comment..." />
			</View>
			<View style={styles.sendButton}>
				<Button type="iconFilled"
					icon="send" disabled={!text.trim() || !!isSending }
					size="s"
					onPress={ onSend } />
			</View>
		</View>
	);
};

export default CommentsInput;

const styles = StyleSheet.create({
	bottomBar: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderTopColor: styleVars.colors.borderBlue,
		borderTopWidth: 1,
		alignItems: 'flex-end',
		minHeight: 50 + getNavigationBarHeight(),
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: getNavigationBarHeight()
	},
	inputWrapper: {
		flex: 1,
		marginRight: 10,
		minHeight: 40,
		justifyContent: 'center',
		fontSize: 16
	},
	input: {
		minWidth: 0,
		fontSize: 16,
		flex: 1
	},
	sendButton: {
		marginBottom: 8
	}
});
