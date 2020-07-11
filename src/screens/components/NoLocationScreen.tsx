import * as React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, Text, Button, styleVars } from '../../components';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';
import locationTracking from '../../location/location.tracking';

interface NoLocationScreenProps extends ScreenProps {

}

class NoLocationScreen extends React.Component<NoLocationScreenProps>{
	state = {
		loading: false
	}

	render() {
		return (
			<Bg type="red" style={ styles.container }>
				<View style={styles.header} >
					<Image source={require('../_img/location.png')}
						style={styles.image} />
					<View style={styles.title}>
						<Text type="header">
							Enable location
						</Text>
					</View>
				</View>
				<View style={styles.body}>
					<View style={styles.card}>
						<View style={styles.content}>
							<View style={styles.paragraph}>
								{ this.props.children }
							</View>
							{ this.renderControls() }
						</View>
					</View>
				</View>
			</Bg>
		);
	}

	renderControls() {
		if( this.canAskForLocation() ){
			return (
				<View style={styles.buttonWrapper}>
					<Button onPress={ this._askForPermission }>
						Enable location
					</Button>
				</View>
			);
		}

		return (
			<View>
				<View style={styles.paragraph}>
					<Text>
						Please go to the phone settings and enable the location for Discov.
					</Text>
				</View>
				<View style={styles.buttonWrapper}>
					<Button onPress={ this._openSettings }>
						Go to settings
					</Button>
				</View>
			</View>
		);
	}

	canAskForLocation() {
		let perm = this.props.store.locationPermissions;

		console.log('Perm', perm );

		return !perm || perm.canAskAgain;
	}

	_askForPermission = () => {
		this.setState({loading: true});

		locationTracking.requestPermissions()
			.then( () => {
				this.setState({loading: false});
			})
		;
	}

	_openSettings = () => {
		Linking.openSettings();
	}
};

export default NoLocationScreen;

const styles = StyleSheet.create({
	container: {
		paddingTop: getNavigationBarHeight(),
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	header: {
		alignItems: 'center',
		marginBottom: 30
	},
	title: {

	},
	image: {
		width: 140,
		height: 136,
		marginBottom: 10
	},
	body: {
		marginBottom: 30,
		alignSelf: 'stretch'
	},
	card: {
		backgroundColor: '#fff',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
		paddingBottom: 20,
		borderRadius: 10,
		marginBottom: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#E6EAF2'
	},
	content: {
		maxWidth: 360,
		minWidth: 1,
		flex: 1,
		overflow: 'hidden',
		alignItems: 'stretch'
	},
	paragraph: {
		marginBottom: 10
	},
	buttonWrapper: {
		marginTop: 10
	}
});
