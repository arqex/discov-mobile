import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, Text, Button, Tooltip, Wrapper } from '../../components';
import onboardingStyles from './onboarding.styles';

export default class Onboarding extends React.Component<ScreenProps> {
	render() {
		return (
			<Bg type="red">
				<View style={onboardingStyles.container}>
					{this.renderHeader()}
					{this.renderContent()}
				</View>
			</Bg>
		)
	}

	renderHeader() {
		return (
			<View style={onboardingStyles.header} >
				<Image source={ require('../_img/people.png') }
					style={ styles.image } />
				<View style={onboardingStyles.title}>
					<Text type="header">We are ready!</Text>
				</View>
			</View>
		)
	}

	renderContent() {
		return (
			<View style={onboardingStyles.body}>
				<View style={onboardingStyles.card}>
					<View style={onboardingStyles.content}>
						<View style={styles.text}>
							<Tooltip type="red">
		{`The basics for your account app are now in place.

Discov is all about sharing with your people, so why not to begin by following some friends to start discovering their stories?`}
							</Tooltip>
						</View>
						<Wrapper textWidth>
							<Button onPress={this._goToPeople}>
								Go find some people
							</Button>
						</Wrapper>
					</View>
				</View>
			</View>
		);
	}

	_goToPeople = () => {
		this.props.router.navigate('/myPeople/morePeople');
	}

	componentWillEnter() {
		this.props.actions.account.updateAccount({
			extra: JSON.stringify({})
		});
	}
}

const styles = StyleSheet.create({
	image: {
		width: 180,
		height: 116,
		marginBottom: 10
	},
	text: {
		marginBottom: 20
	}
});