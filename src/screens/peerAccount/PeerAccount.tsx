import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import AccountProvider from '../../providers/AccountProvider';
import { Bg, ScrollScreen, Text, Avatar, TopBar } from '../../components';
import storeService from '../../state/store.service';
import FollowingCard from './FollowingCard';
import FollowerCard from './FollowerCard';

interface PeerAccountProps extends ScreenProps {
	account: any,
	accountId: string,
	onBackPress: Function
}

class PeerAccount extends Component<PeerAccountProps> {
	loadingMeta = false
	animatedScrollValue = new Animated.Value(0)

	state = {
		loading: false
	}

	render() {
		let account = this.props.account;
		let accountMeta = this.getAccountMeta();
		
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader( account ) }
					topBar={this.renderTopBar(account)}
					animatedScrollValue={this.animatedScrollValue}
					loading={!accountMeta}>
						<View style={{ marginTop: 20 }}>
							<FollowingCard
								loading={ this.state.loading }
								account={account}
								meta={accountMeta && accountMeta.asPublisher}
								onFollow={this._follow}
								onUnfollow={this._unfollow} />
							<FollowerCard key="follower"
								account={account}
								meta={accountMeta && accountMeta.asFollower} />
						</View>
				</ScrollScreen>
			</Bg>
		)
	}

	renderHeader( account ){
		let acc = account || {
			displayName: '', avatarPic: false, description: ''
		};
		
		return (
			<View style={styles.openHeader}>
				<View style={styles.avatar}>
					<Avatar name={acc.displayName}
						pic={acc.avatarPic}
						size={70}
						border={2}
						borderColor="blue" />
				</View>
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
					<Avatar name={acc.displayName} pic={acc.avatarPic} size={30} border={2} />
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

	getAccountMeta(){
		return storeService.getPeerMeta( this.props.accountId );
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour

	componentDidMount(){
		let accountMeta = this.getAccountMeta();
		
		if( !accountMeta || !accountMeta.valid || accountMeta.lastUpdatedAt + this.EXPIRE_TIME < Date.now() ){
			// Reload the data when is not valid or expired
			this.loadMeta();
		}
	}

	componentDidUpdate( prevProps ) {
		let meta = this.getAccountMeta();
		
		if( prevProps.accountId !== this.props.accountId && !meta ){
			this.loadMeta();
		}

		if( meta && !meta.valid ){
			this.loadMeta();
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
}


const styles = StyleSheet.create({
	openHeader: {
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 30
	},
	description: {
		textAlign: 'center'
	}
});

export default AccountProvider(PeerAccount);