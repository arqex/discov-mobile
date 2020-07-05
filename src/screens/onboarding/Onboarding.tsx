import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Bg, Tooltip, Text, Button, styleVars, Wrapper } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import onboardingStyles from './onboarding.styles';

export default class Onboarding extends React.Component<ScreenProps> {
	render() {
		return (
			<Bg type="red">
				<View style={onboardingStyles.container }>
					{this.renderHeader()}
					{this.renderContent()}
				</View>
			</Bg>
		)
	}

	renderHeader() {
		return (
			<View style={onboardingStyles.header} >
				<Image source={ require('../_img/ventana.png') }
					style={ styles.image } />
				<View style={onboardingStyles.title}>
					<Text type="header">Welcome!</Text>
				</View>
			</View>
		)
	}

	renderContent() {
		return (
			<View style={onboardingStyles.body}>
				<View style={onboardingStyles.card}>
					<View style={onboardingStyles.content}>
						<Tooltip type="red">{`It's so great to have you in discov!

Your are really close to start discovering around you, and place stories for your friends.

But first, let's configure your account...`}
						</Tooltip>
						<Text type="paragraph">
						</Text>
						<Wrapper textWidth margin="10 0 0 0">
							<Button type="border"
								icon="arrow-forward"
								iconPosition="post"
								iconColor={styleVars.colors.primary}
								onPress={() => this.props.router.navigate('/onboarding/details')}>
								Go!
							</Button>
						</Wrapper>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
	image: {
		width: 160,
		height: 136,
		marginBottom: 10,
		transform: [{translateX: -3 }]
	},
});