import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, Text, Button, styleVars } from '../../components';
import onboardingStyles from './onboarding.styles';
import * as Location from 'expo-location';
import storeService from '../../state/store.service';

export default class OnboardingLocation extends React.Component<ScreenProps> {
	state = {
		permissionDenied: false, 
		loading: false
	}

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
				<Image source={ require('../_img/location.png') }
					style={ styles.image } />
				<View style={onboardingStyles.title}>
					<Text type="header">What's around?</Text>
				</View>
			</View>
		)
	}

	renderContent() {
		if( this.state.permissionDenied ) {
			return this.renderDenied();
		}

		return (
			<View style={onboardingStyles.body}>
				<View style={onboardingStyles.card}>
					<View style={onboardingStyles.content}>
						<View style={styles.text}>
							<Text>{`In order to discover the stories that your friends leave around you, discov need to access to your location.

Please enable your location.`}</Text>
						</View>
						<View style={styles.button}>
							<Button onPress={ this._askForLocation } loading={ this.state.loading }>
								Enable location
							</Button>
						</View>
						<View style={styles.button}>
							<Button type="transparent" onPress={ this._goNext }>
								Skip for now
							</Button>
						</View>
					</View>
				</View>
			</View>
		);
	}

	renderDenied() {
		return (
			<View style={onboardingStyles.body}>
				<View style={onboardingStyles.card}>
					<View style={onboardingStyles.content}>
						<View style={styles.text}>
							<Text>
	{`Seems that discov can't access to the location.

You will be asked again when you start following friends or try to create your fist story, since you need it to place and discover stories.
`}
							</Text>
						</View>
						<Button type="border"
							icon="arrow-forward"
							iconPosition="post"
							iconColor={ styleVars.colors.primary }
							onPress={ this._goNext }>
							Continue
						</Button>
					</View>
				</View>
			</View>
		)
	}

	_askForLocation = () => {
		this.setState({loading: true});
		return Location.requestPermissionsAsync()
			.then( permissions => {
				storeService.setLocationPermissions( permissions );
				if( permissions.granted ){
					return this.goNext();
				}

				this.setState({
					loading: false,
					permissionDenied: true
				})
			})
	}

	_skip = () => {
		this.setState({
			permissionDenied: true
		});
	}

	_goNext = () => {
		this.props.router.navigate('/onboarding/details/location/people');
	}

	componentDidMount() {
		Location.getPermissionsAsync()
			.then( permissions => {
				if( permissions.granted ){
					this.setState({ loading: false });
					return this._goNext();
				}

				if( !permissions.canAskAgain ){
					this.setState({
						loading: false,
						permissionDenied: true
					});
				}
			})
		;
	}
}


const styles = StyleSheet.create({
	button: {
		marginTop: 10
	},
	image: {
		width: 140,
		height: 136,
		marginBottom: 10
	},
	text: {
		marginBottom: 10
	}
});