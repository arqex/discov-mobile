import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, TopBar, Panel, ListItem, Button, Wrapper, Modal, styleVars } from '../../components';
import AccountAvatar from '../components/AccountAvatar';

export default class Account extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	render() {
		return (
			<Bg>
				<ScrollScreen
					animatedScrollValue={this.animatedScrollValue}
					topBar={ this.renderTopBar() }
					header={ this.renderHeader() }>
					<Panel style={ styles.panel }>
						{ this.renderAvatarPicker() }
						{ this.renderDisplayName() }
						{ this.renderDescription() }
						{ this.renderHandler() }
						{ this.renderDelete() }
					</Panel>
				</ScrollScreen>
			</Bg>
		)
	}

	renderTopBar() {
		return (
			<TopBar title="Settings"
				onBack={ () => this.props.drawer.open() }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}

	renderHeader() {
		return <Text type="header">{__('myAccount.title')}</Text>;
	}

	renderAvatarPicker() {
		let account = this.props.store.user.account;
		let avatar = (
			<Wrapper margin="0 10 0 0">
				<AccountAvatar accountId={account.id} size={50} />
			</Wrapper>
		);
		let title = 'Change my image';
		let removeButton;

		if( account.avatarPic ){
			title = 'Update my image';
			removeButton = (
				<Button type="transparent" color="primary" size="s">
					Remove
				</Button>
			);
		}

		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					onPress={ this._openDisplayNameModal }
					titleColor={ styleVars.colors.text }
					style={styles.listItem}
					pre={avatar}
					title={title}
					post={removeButton}
				/>
				{ this.renderSeparator() }
			</Wrapper>
		);
	}

	renderDisplayName() {
		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					titleColor={ styleVars.colors.text }
					style={styles.listItem}
					overtitle="My display name:"
					title={ this.props.store.user.account.displayName }
				/>
				{ this.renderSeparator() }
			</Wrapper>
		);
	}

	renderDescription() {
		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					titleColor={ styleVars.colors.text }
					style={styles.listItem}
					overtitle="My bio:"
					title={this.props.store.user.account.description}
				/>
				{ this.renderSeparator() }
			</Wrapper>
		);
	}

	renderHandler() {
		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					titleColor={ styleVars.colors.text }
					style={styles.listItem}
					overtitle="My handle:"
					title={ '@' + this.props.store.user.account.handle }
				/>
				{ this.renderSeparator() }
			</Wrapper>
		);
	}

	renderDelete() {
		return (
			<ListItem
				style={styles.listItem}
				titleColor={styleVars.colors.primary}
				title="Delete account"
			/>
		);
	}

	renderSeparator() {
		return <Wrapper style={ styles.separator } />;
	}

	_openDisplayNameModal() {
		return console.log('Somenthi');
		Modal.open( <DisplayNameModal /> );
	}
}

const styles = StyleSheet.create({
	container: {

	},
	panel: {
		paddingTop: 10,
		paddingBottom: 10
	},
	itemWrapper: {
		alignSelf: 'stretch',
		alignItems: 'stretch'
	},
	listItem: {
		paddingTop: 12,
		paddingBottom: 12,
		width: styleVars.textWidth,
		alignSelf: 'center'
	},
	separator: {
		width: 320,
		height: 1,
		backgroundColor: '#eee',
		alignSelf: 'center'
	}
});
