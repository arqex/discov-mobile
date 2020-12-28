import * as React from 'react';
import { StyleSheet, Alert, Animated, View } from 'react-native';
import { ScrollScreen, Text, Panel, Bg, SettingItem, TopBar, Modal, ModalContent, Touchable } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
 
class Settings extends React.Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	state={
		version: ''
	}

	notifId = 0
	render() {
		const header = (
			<Text type="header">Settings</Text>
		);

		let topBar = (
			<TopBar title="Settings"
				onBack={ () => this.props.drawer.open() }
				post={ this.renderDevSettingsButton() }
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
						<SettingItem title="Closest discovery"
							subtitle="Closer than 400m"
							onPress={ () => this.props.router.navigate('/settings/closestDiscovery')}
							border />
						<SettingItem title="Location report"
							onPress={ () => this.props.router.navigate('/settings/locationReport')}
							border />
						<SettingItem title="Log out" onPress={this._openConfirm} />
					</Panel>
				</ScrollScreen>
			</Bg>
		);
	}

	renderDevSettingsButton(){
		return (
			<Touchable onPress={ () => this.props.router.navigate('/settings/dev') }>
				<View style={{width:20, height: 20}} />
			</Touchable>
		)
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
