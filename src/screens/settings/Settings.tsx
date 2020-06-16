import * as React from 'react';
import { StyleSheet, Alert, Animated, View } from 'react-native';
import { ScrollScreen, Text, Panel, Bg, Button, SettingItem, TopBar, Modal, ModalContent } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import notifications from '../../utils/notifications';
import storeService from '../../state/store.service';
 
class Settings extends React.Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	notifId = 0
	render() {
		const header = (
			<Text type="header">Settings</Text>
		);

		let topBar = (
			<TopBar title="Settings"
				onBack={ () => this.props.drawer.open() }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		return (
			<Bg type="red">
				<ScrollScreen header={header}
					animatedScrollValue={this.animatedScrollValue}
					topBar={topBar}>
					<Panel style={styles.panel}>
						<SettingItem title="Invitations"
							subtitle="Given away 3 out of 5"
							border />
						<SettingItem title="Log out" onPress={this._openConfirm} />
					</Panel>
					<Panel style={styles.panel}>
						<SettingItem title="See component gallery"
							onPress={ () => this.props.router.navigate('/componentGallery')} 
							border />
						<SettingItem title="See location report"
							onPress={ () => this.props.router.navigate('/locationReport')} 
							border />
						<SettingItem title="Open notification"
							onPress={this._openNotification}
							border />
						<SettingItem title="Empty cache data"
							onPress={this._emptyCacheData}
							border />
						<SettingItem title="Open modal"
							onPress={this._openModal}
							border />
						<SettingItem title="Reset onboarding"
							onPress={this._resetOnboarding} />
					</Panel>
				</ScrollScreen>
			</Bg>
		);
	}

	_openConfirm = () => {
		Alert.alert('Log out', 'Are you sure you want to exit?', [
			{ text: 'Cancel' },
			{ text: 'Log out', onPress: this._logout }
		]);
	}

	_logout = () => {
		this.props.actions.auth.logout()
			.then( () => {
				this.props.router.navigate('/');
			})
		;
	}

	_openNotification = () => {
		let discoveries = [{"createdAt": "2020-06-09T17:15:18.911Z", "discovererId": "acTUrealTestLow", "extra": "{\"seen\":false}", "id": "diGRYF53q2TCyTen3IrvMGvg", "owner": {"avatarPic": "https://javiio.com/img/javi.jpg", "description": "Por el contrario podemos ahorrar un buen dinero adquiriendo la más barata", "displayName": "Javi Testing", "handle": "realstories", "id": "acTUrealTestStoriesUser"}, "ownerId": "acTUrealTestStoriesUser", "story": {"aggregated": "{\"place\":{\"type\":\"custom\",\"name\":\"Some place\"}}", "content": "{\"type\":\"text\",\"text\":\"La terraza del 100 montaditos algún día volverá a abrir pa que los chavales puedan comer y beber barato. Tienes que pasar a 10 metros de este punto para descubrirlo.\"}", "createdAt": "2019-10-09T15:37:27.000Z", "id": "stTUrealTestStoriesUser7", "lat": 41.3977, "lng": 2.1715, "ownerId": "acTUrealTestStoriesUser", "status": "published"}, "storyId": "stTUrealTestStoriesUser7"}];

		notifications.getCurrent()
			.then( notifs => console.log('Notifs', notifs) )
		;

		if( this.notifId ){
			//notifications.clear();
			delete this.notifId;
		}
		else {
			notifications.createDiscoveriesNofication( discoveries );
			// this.notifId = notifications.create('new_discoveries', discoveries );
		}
	}

	_emptyCacheData = () => {
		storeService.resetStore();
	}

	_resetOnboarding = () => {
		this.props.actions.account
			.updateAccount({
				extra: JSON.stringify({needOnboarding: true})
			})
			.then( res => {
				this.props.router.navigate('/onboarding')
			})
		;
	}

	_openModal = () => {
		Modal.open(
			<ModalContent
				title='This is a modal'
				description='With a description prop where we can explain things better'
				controls={[
					{ text: 'Ok', onPress: () => Modal.close() },
					{text: 'Close', type: 'transparent', onPress: () => Modal.close() }
				]}
			/>
		);
	}
};

export default Settings;

const styles = StyleSheet.create({
	container: {},
	panel: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 30,
		paddingRight: 30,
		marginBottom: 20
	},
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 30,
		paddingRight: 30
	}
});
