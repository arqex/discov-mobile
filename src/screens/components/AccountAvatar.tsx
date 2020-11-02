import * as React from 'react';
import { View } from 'react-native';
import Avatar from '../../components/Avatar';
import AccountProvider from '../../providers/AccountProvider';

interface AccountAvatarProps {
	accountId: string,
	account: any,
	size?: number,
	border?: number,
	borderColor?: 'white' | 'red' | 'blue' | 'light'
}

class AccountAvatar extends React.Component<AccountAvatarProps> {
	render() {
		const { account, size = 42} = this.props;
		return (
			<Avatar name={account.displayName}
				pic={account.avatarPic}
				size={size}
				border={this.props.border}
				borderColor={this.props.borderColor} />
		);
	}

	static renderLoading(props) {
		let styles = {
			width: props.size, height: props.size,
			borderRadius: props.size / 2,
			borderWidth: 2,
			borderColor: '#fff',
			backgroundColor: '#ddd'
		};

		return <View style={styles}></View>;
	}
}

export default AccountProvider(AccountAvatar);