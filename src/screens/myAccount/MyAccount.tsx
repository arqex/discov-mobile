import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, TopBar, Panel, ListItem, Button, Wrapper, Modal, styleVars, ModalContent } from '../../components';
import AccountAvatar from '../components/AccountAvatar';
import AvatarModal from './AvatarModal';
import DisplayNameModal from './DisplayNameModal';
import DescriptionModal from './DescriptionModal';
import HandleModal from './HandleModal';
import RemoveAvatarModal from './RemoveAvatarModal';

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
						{ this.renderHandle() }
						{ this.renderDelete() }
					</Panel>
				</ScrollScreen>
			</Bg>
		)
	}

	renderTopBar() {
		return (
			<TopBar title={__('myAccount.title')}
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
				<Button type="transparent" color="primary" size="s" onPress={ this._openRemoveAvatarModal }>
					Remove
				</Button>
			);
		}

		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					onPress={ this._openAvatarModal }
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
					onPress={ this._openDisplayNameModal }
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
					onPress={ this._openDescriptionModal }
					titleColor={ styleVars.colors.text }
					style={styles.listItem}
					overtitle="My bio:"
					title={this.props.store.user.account.description}
				/>
				{ this.renderSeparator() }
			</Wrapper>
		);
	}

	renderHandle() {
		return (
			<Wrapper style={ styles.itemWrapper }>
				<ListItem
					onPress={ this._openHandleModal }
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

	_openAvatarModal = () => {
		Modal.open(
			<AvatarModal
				onSave={this._updateAccount}
			/>
		);
	}

	_openRemoveAvatarModal = () => {
		Modal.open(
			<RemoveAvatarModal onSave={ this._updateAccount } />
		);
	}

	_openDisplayNameModal = () => {
		Modal.open(
			<DisplayNameModal
				initialDisplayName={ this.props.store.user.account.displayName }
				onSave={ this._updateAccount }
			/>
		);
	}

	_openDescriptionModal = () => {
		Modal.open(
			<DescriptionModal
				initialDescription={ this.props.store.user.account.description }
				onSave={ this._updateAccount }
			/>
		);
	}

	_openHandleModal = () => {
		Modal.open(
			<HandleModal
				initialHandle={this.props.store.user.account.handle}
				onSave={this._updateAccount}
			/>
		);
	}

	_updateAccount = ( field, value ) => {
		return this.props.actions.account.updateAccount({[field]: value})
			.then( () => {
				Modal.close();
			})
		;
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
