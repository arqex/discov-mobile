import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ViewPagerAndroidBase } from 'react-native'
import { Bg, Logo, Button, Avatar, Text, Wrapper, styleVars, Touchable } from '../components'
import { ScreenProps } from '../utils/ScreenProps';
import { getStatusbarHeight } from '../components/utils/getStatusbarHeight';
import storeService from '../state/store.service';
import '../utils/i18n';

export default class Menu extends Component<ScreenProps> {
	constructor( props ){
		super( props );
		Button.setRouter( this.props.router );
	}

	render() {
		let containerStyles = [
			styles.container,
			{ width: Dimensions.get('window').width }
		];

		let user = this.props.store.user;
		if( !user || !user.account ){
			return (
				<View style={ containerStyles }>
				</View>
			);
		}

		// this.setFakeUser();

		let account = user.account;

		return (
			<Bg type="red">
				<Wrapper screenPadding style={ containerStyles }>
					<View style={ [styles.topBar, {paddingTop: getStatusbarHeight()}] }>
						<Logo textColor={ styleVars.colors.blueText } />
						<Button type="icon" icon="more-horiz" color="secondary"
							onPress={ this.props.drawer.close }
							link="/settings" />
					</View>
					<View style={ styles.account }>
						<View style={ styles.accountTouchableWrapper }>
							<Touchable onPress={ this._goToMyAccount }
								style={ styles.accountLink }>
								<View style={{alignItems: 'center'}}>
									<View style={ styles.avatar }>
										<Avatar name={ account.displayName }
											pic={ account.avatarPic }
											size={ 60 }
											border={ 3 }
											borderColor="red" />
									</View>
									<Text type="header">{account.displayName}</Text>
								</View>
							</Touchable>
						</View>
					</View>
					<View style={ styles.sections }>
						<View style={ styles.button }>
							<Button type="menu"
								icon="explore"
								color="secondary"
								iconColor={ styleVars.colors.primary }
								onPress={ this.props.drawer.close } link="/myStories">
								{ __('menu.stories') }
							</Button>
						</View>
						<View style={ [styles.button, styles.discoveries] }>
							<Button type="menu"
								icon="gps-fixed"
								color="secondary"
								iconColor={ styleVars.colors.primary }
								onPress={ this.props.drawer.close } link="/myDiscoveries">
								{__('menu.discoveries')}
							</Button>
							{ this.renderDiscoveryCounter() }
						</View>
						<Button type="menu"
							icon="face"
							color="secondary"
							iconColor={ styleVars.colors.primary }
							onPress={ this.props.drawer.close } link="/myPeople">
							{__('menu.people')}
						</Button>
					</View>
					<Wrapper textWidth style={ styles.create }>
						<Button icon="looks" onPress={this.props.drawer.close} link="/createStory">
							{__('menu.create')}
						</Button>
					</Wrapper>
				</Wrapper>
			</Bg>
		)
	}

	renderDiscoveryCounter() {
		let unseenCount = storeService.getUnseenCount();
		if( unseenCount ){
			return (
				<View style={ styles.unseenCountWrapper }>
					<View style={ styles.badge }>
						<Text style={{color: '#fff', fontWeight: '600'}}>{ unseenCount }</Text>
					</View>
				</View>
			);
		}
	}

	fakeUser = false;
	setFakeUser() {
		if (!this.fakeUser) {
			this.fakeUser = true;
			let account = this.props.store.user.account;
			account.displayName = 'Ada López';
			this.props.store.peerAccounts[ account.id ].displayName = 'Ada López';
		}
	}

	_goToMyAccount = () => {
		this.props.drawer.close();
		this.props.router.navigate('/myAccount');
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingRight: 30,
		paddingBottom: 20,
		paddingLeft: 30
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// backgroundColor: '#ff0000'
	},
	account:{
		flex: 2,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// backgroundColor: '#00ff00'
	},
	
	accountLink: {
		alignItems: 'center',
		padding: 10,
	},

	accountTouchableWrapper: {
		borderRadius: 10,
		overflow: 'hidden'
	},

	avatar: {
		marginBottom: 5
	},

	sections: {
		flex: 4, 
		alignItems: 'center',
		// backgroundColor: '#00f0f0',
		justifyContent: 'center'
	},

	button: {
		marginBottom: 10
	},

	discoveries: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	
	create: {
		flex: 2,
		alignItems: 'stretch',
		alignSelf: 'center'
		// backgroundColor: '#ff00ff'
	},

	unseenCountWrapper: {
		width: 1,
		transform: [
			{ translateX: -7 },
			{ translateY: 1 },
		]
	},

	badge: {
		backgroundColor: styleVars.colors.primary,
		borderRadius: 9,
		height: 20, width: 20,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
