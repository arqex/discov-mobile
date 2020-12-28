import * as React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, Text, Button, styleVars } from '../../components';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';
import locationStore from '../../location/location.store';

interface BGLocationScreenProps extends ScreenProps {

}

class BGLocationScreen extends React.Component<BGLocationScreenProps>{
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
							Location in the Background
						</Text>
					</View>
				</View>
				<View style={styles.body}>
					<View style={styles.card}>
						<View style={styles.content}>
							<View style={styles.paragraph}>
                <Text>
								  To discover your friend's stories while your phone's screen is off, Discov needs access to the location when the app is not actively used.
                </Text>
							</View>
              <View style={styles.paragraph}>
                <Text>
                  Please open the settings and give Discov permission to access to the location "All the time".
                </Text>
              </View>
              <View style={styles.paragraph}>
                <Text>
                  The app will try to know your position only when you are on the move and you can always check when the location has been accessed by Discov in the location report.
                </Text>
              </View>
							{ this.renderControls() }
						</View>
					</View>
				</View>
			</Bg>
		);
	}

	renderControls() {
		return (
			<View>
				<View style={styles.buttonWrapper}>
					<Button onPress={ this._openSettings }>
						Open settings
					</Button>
				</View>
				<View style={styles.buttonWrapper}>
					<Button onPress={ () => this.props.router.back() } type="transparent">
					  Not now
					</Button>
				</View>
			</View>
		);
	}

	_openSettings = () => {
		Linking.openSettings();
	}

	componentWillLeave() {
		locationStore.refreshBackgroundRequestedAt();
	}
};

export default BGLocationScreen;

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
