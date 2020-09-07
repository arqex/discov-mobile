import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Avatar from '../../components/Avatar';
import AccountProvider from '../../providers/AccountProvider';

interface AccountAvatarProps {
	account: any,
	size?: number,
	border?: number,
	borderColor?: 'white' | 'red' | 'blue' | 'light'
}

const AccountAvatar = (props: AccountAvatarProps) => {
	const account = props.account;
	const size = props.size || 42;

	if (!account) {
		return renderLoading( size );
	}

	return (
		<Avatar name={account.displayName}
			pic={account.avatarPic}
			size={ size }
			border={ props.border }
			borderColor={ props.borderColor } />
	);
};

function renderLoading( size ) {
	let styles = {
		width: size, height: size,
		borderRadius: size / 2,
		borderWidth: 2,
		borderColor: '#fff',
		backgroundColor: '#ddd'
	};

	return <View style={ styles }></View>;
}

export default AccountProvider(AccountAvatar);

const styles = StyleSheet.create({
});
