import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing, Platform, StatusBar } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import AccountProvider from '../../providers/AccountProvider';
import { Bg, ScrollScreen, Text, Avatar, TopBar, Touchable, Tooltip } from '../../components';
import storeService from '../../state/store.service';
import FollowingCard from './FollowingCard';
import FollowerCard from './FollowerCard';
import PeerAccountImageViewer from './PeerAccountImageViewer';
import BackButtonHandler from '../../utils/BackButtonHandler';
import ConnectionContext from '../../utils/ConnectionContext';

interface PeerAccountProps extends ScreenProps {
	account: any,
	accountId: string,
	onBackPress: Function
}

class PeerAccount extends Component<PeerAccountProps> {
	static contextType = ConnectionContext.Context

	loadingMeta = false
	animatedScrollValue = new Animated.Value(0)
	animatedImage = new Animated.Value(0)

	state = {
		loading: false,
		isImageOpen: false,
		avatarBox: false
	}

	render() {
		let account = this.props.account;
		let accountMeta = this.getAccountMeta();
		
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader( account ) }
					topBar={this.renderTopBar(account)}
					animatedScrollValue={this.animatedScrollValue}
					loading={this.context.isConnected && !accountMeta}>
						{ this.renderCards( account, accountMeta ) }
				</ScrollScreen>
				{ this.renderImageViewer(account) }
			</Bg>
		)
	}

	renderHeader( account ){
		let acc = account || {
			displayName: '', avatarPic: false, description: ''
		};
		
		return (
			<View style={styles.openHeader}>
				<Touchable onPress={this._openImage}>
					<View style={styles.avatar}
						ref="avatar"
						onLayout={ this._onAvatarLayout }>
						<Avatar name={acc.displayName}
							pic={acc.avatarPic}
							size={70}
							border={2}
							borderColor="blue" />
					</View>
				</Touchable>
				<Text type="header">{acc.displayName}</Text>
				{ this.renderDescription( acc ) }				
			</View>
		);
	}

	renderTopBar( account ){
		let acc = account || {
			displayName: '', avatarPic: false, description: ''
		};

		return (
			<TopBar
				onBack={ this.props.onBackPress }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea>
				<View style={styles.avatar}>
					<Avatar name={acc.displayName}
						pic={acc.avatarPic}
						size={30}border={2} />
					<Text type="mainTitle">{acc.displayName}</Text>
				</View>
			</TopBar>
		);
	}

	renderDescription( account ) {
		if( !account.description.trim() ) return;
		return (
			<View style={{ marginTop: 6 }}>
				<Text type="quote" numberOfLines={3} style={styles.description}>
					"{account.description.trim()}"
				</Text>
			</View>
		);
	}

	renderImageViewer( account ) {
		let viewerStyles = [
			styles.viewer,
			{ zIndex: this.state.isImageOpen ? 10 : -10 }
		];

		return (
			<View style={ viewerStyles }>
				<PeerAccountImageViewer
					animatedValue={this.animatedImage}
					onBack={this._closeImage}
					imageUri={account.avatarPic.replace(/_s$/, '')}
					initialBox={this.state.avatarBox} />
			</View>
		);
	}
	
	renderCards( account, accountMeta ) {
		if( !this.context.isConnected && !this.isValidMeta(accountMeta) ){
			return this.renderNoConnection(account);
		}
		if( !this.isCurrentUserAccount() ){
			return (
				<View style={{ marginTop: 20 }}>
					<FollowingCard
						loading={this.state.loading}
						account={account}
						meta={accountMeta && accountMeta.asPublisher}
						onFollow={this._follow}
						onUnfollow={this._unfollow} />
					<FollowerCard key="follower"
						account={account}
						meta={accountMeta && accountMeta.asFollower} />
				</View>
			)
		}
	}

	renderNoConnection(account){
		return (
			<View style={{padding: 20}}>
				<Tooltip>Connect to internet to load {account.displayName}'s info.</Tooltip>
			</View>
		);
	}

	isCurrentUserAccount(){
		return this.props.accountId === storeService.getUserId();
	}

	getAccountMeta(){
		return this.isCurrentUserAccount() ? {current: true} : storeService.getPeerMeta( this.props.accountId );
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	componentDidMount(){
		if( this.props.isConnected && !this.isValidMeta( this.getAccountMeta() ) ){
			// Reload the data when is not valid or expired
			this.loadMeta();
		}

		setTimeout( () => {
			// On android, onLayout is not called sometimes on mount
			// so we do it manually
			if( !this.layoutCalled ){
				this._onAvatarLayout();
			}
		}, 300);
	}
	isValidMeta( meta ){
		if( meta && meta.current ) return true;
		return meta && meta.valid && meta.lastUpdateAt + this.EXPIRE_TIME >= Date.now();
	}

	componentDidUpdate( prevProps ) {
		let isValidMeta = this.isValidMeta( this.getAccountMeta() );

		if( !prevProps.isConnected && this.props.isConnected && !isValidMeta ){
			this.loadMeta();
		}
		if( this.props.isConnected ){
			if( prevProps.accountId !== this.props.accountId && !isValidMeta ){
				this.loadMeta();
			}
		}
	}

	loadMeta(){
		this.loadingMeta = true;
		this.props.actions.account.loadPeerMeta( this.props.accountId );
	}

	getShortName() {
		let displayName = this.props.account.displayName;
		let parts = displayName.split('\s+');
		return parts[0];
	}

	_follow = () => {
		this.setState({loading: true});
		this.props.actions.relationship.follow( this.props.accountId )
			.then( () => {
				this.setState({ loading: false });
			})
		;
	}

	_unfollow = () => {
		this.setState({loading: true});
		this.props.actions.relationship.unfollow( this.props.accountId )
			.then( () => {
				this.setState({ loading: false });
			})
		;
	}

	_openImage = () => {
		console.log('OpenImage');
		Animated.timing( this.animatedImage, {
			toValue: 1,
			duration: 800,
			useNativeDriver: true,
			easing: Easing.out(Easing.cubic)
		}).start();
		this.setState({isImageOpen: true});
		BackButtonHandler.addListener( this._onBackPress );
		StatusBar.setBarStyle('light-content');
	}

	_closeImage = () => {
		BackButtonHandler.removeListener( this._onBackPress );
		Animated.timing(this.animatedImage, {
			toValue: 0,
			duration: 600,
			useNativeDriver: true,
			easing: Easing.in(Easing.cubic)
		}).start( () => {
			this.setState({ isImageOpen: false });
			StatusBar.setBarStyle('dark-content');
		});
	}

	_onBackPress = () => {
		if( this.state.isImageOpen ){
			this._closeImage();
			return true;
		}
		return false;
	}

	_onAvatarLayout = () => {
		console.log( this.refs.avatar );

		this.layoutCalled = true;

		// This timeout will prevent calculating the position of the avatar
		// while the sreen is been animated in.
		setTimeout( () => {
			this.refs.avatar.measure((cx, cy, width, height, x, y) => {
				this.setState({
					avatarBox: {
						width, height, x,
						y: y
					}
				});
			});
		}, 300);
	}

	componentWillUnmount() {
		BackButtonHandler.removeListener( this._onBackPress );
	}
}


const styles = StyleSheet.create({
	openHeader: {
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 30
	},
	description: {
		textAlign: 'center'
	},
	viewer: {
		position: 'absolute',
		top: 0, bottom: 0, right: 0, left: 0,
		zIndex: 7
	}
});

export default AccountProvider(PeerAccount);