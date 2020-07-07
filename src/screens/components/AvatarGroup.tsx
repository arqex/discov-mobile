import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import AccountAvatar from './AccountAvatar';
import Tag from '../../components/Tag';
import Avatar from '../../components/Avatar';

interface AvatarGroupProps {
	userIds: Array<string>,
	size: number,
	total?: number | string
}

export default class AvatarGroup extends React.Component<AvatarGroupProps> {
	static defaultProps = {
		size: 32
	}

	render() {
		let size = this.props.size;
		let groupStyles = [
			styles.container,
			{ width: size, height: size }
		];
		return (
			<View style={ groupStyles }>
				{ this.renderAvatars() }
				{ this.renderTotal() }
			</View>
		);
	}

	renderAvatars() {
		if( !this.props.total ){
			return (
				<View style={styles.avatar}>
					<Avatar name="People"
						pic={require('./img/group.png')}
						size={ this.props.size } />
				</View>
			);
		}

		const { userIds } = this.props;
		let avatarSize = this.getAvatarSize( userIds );
		let sizeStyle = { width: avatarSize, height: avatarSize};

		return userIds.slice(0, 3).map( (id, i) => (
			<View key={id} style={[styles.avatar, styles[`avatar_${userIds.length}_${i}`], sizeStyle]}>
				<AccountAvatar size={avatarSize} accountId={id} />
			</View>
		));
	}

	renderTotal() {
		const total = this.props.total;
		if( !total ) return;

		return (
			<View style={ styles.total } key="total">
				<Tag size="xs">{ total }</Tag>
			</View>
		);
	}

	getAvatarSize( userIds ){
		let size = this.props.size;

		if( userIds.length > 2 ){
			return size - 8;
		}
		else if( userIds.length === 2 ){
			return size - 4;
		}
		return size;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	avatar: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	avatar_2_1: {
		top: 4, right: 4
	},
	avatar_3_1: {
		top: 4, right: 4
	},
	avatar_3_2: {
		top: 8, right: 8
	},
	total: {
		position: 'absolute',
		bottom: 0, right: 0
	}
});
