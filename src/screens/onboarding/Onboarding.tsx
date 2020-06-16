import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Bg, Logo, Text, Button, styleVars } from '../../components';
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
						<Text type="paragraph">{`It's so great to have you in discov!

Your are really close to start discovering around you, and place stories for your friends.

But first, let's configure your account...`}
						</Text>
						<View style={styles.buttonWrapper}>
							<Button type="border"
								icon="arrow-forward"
								iconPosition="post"
								iconColor={styleVars.colors.primary}
								onPress={() => this.props.router.navigate('/onboarding/details')}>
								Go!
							</Button>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonWrapper: {
		marginTop: 20
	},
	
	image: {
		width: 160,
		height: 136,
		marginBottom: 10,
		transform: [{translateX: -3 }]
	},
});