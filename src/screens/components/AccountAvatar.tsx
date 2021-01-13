import * as React from 'react';
import { View } from 'react-native';
import Avatar from '../../components/Avatar';
import accountLoader from '../../state/loaders/accountLoader';

interface AccountAvatarProps {
	accountId?: string,
	size?: number,
	border?: number,
	borderColor?: 'white' | 'red' | 'blue' | 'light'
}

export default class AccountAvatar extends React.Component<AccountAvatarProps> {
	render() {
		const account = accountLoader.getData( this, this.props.accountId );
		const size = this.props.size || 42;

		if( !account.data ){
			return this.renderLoading( size );
		}
		
		return (
			<Avatar name={account.data.displayName}
				pic={account.data.avatarPic}
				size={ size }
				border={this.props.border}
				borderColor={this.props.borderColor} />
		);
	}

	renderLoading(size) {
		let styles = {
			width: size, height: size,
			borderRadius: size / 2,
			borderWidth: 2,
			borderColor: '#fff',
			backgroundColor: '#ddd'
		};

		return <View style={styles}></View>;
	}
}