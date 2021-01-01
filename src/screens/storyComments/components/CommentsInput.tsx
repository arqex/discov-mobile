import * as React from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import { Button, styleVars } from '../../../components';
import { getNavigationBarHeight } from '../../../components/utils/getNavigationBarHeight';

interface CommentsInputProps {
	text: string
	onChange: (text:string) => any,
	onSend: () => any,
	isSending: boolean,
	isConnected: boolean
}

// This value is set by observing the initial height of the input on both OS
const initialInputHeight = Platform.OS === 'android' ? 40.2 : 19.5;

const CommentsInput = ({text, onChange, onSend, isSending, isConnected}: CommentsInputProps) => {
	let [inputHeight, setInputHeight] = React.useState( initialInputHeight );

	let inputStyles = [
		styles.input,
		isSending && {opacity: .6},
		{ height: inputHeight }
	];

	return (
		<View style={styles.bottomBar}>
			<View style={ getWrapperStyles(inputHeight) }>
				<TextInput style={inputStyles}
					value={ text }
					onChangeText={ onChange }
					editable={isConnected}
					multiline
					onContentSizeChange={ e => setInputHeight( e.nativeEvent.contentSize.height )}
					placeholder={ isConnected ? "Write a comment..." : "No connection" } />
			</View>
			<View style={styles.sendButton}>
				<Button type="iconFilled"
					icon="send"
					disabled={!isConnected || !text.trim() || !!isSending }
					size="s"
					onPress={ onSend } />
			</View>
		</View>
	);
};

function getWrapperStyles( inputHeight ){
	let offset = Platform.OS === 'android' ? 8 : 20.5;
	return [
		styles.input,
		{height: Math.min( 120, inputHeight + offset )}
	];
}

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
		fontSize: 16,
	},
	input: {
		minWidth: 0,
		fontSize: 16,
		flex: 1
	},
	sendButton: {
		marginBottom: 4
	}
});
