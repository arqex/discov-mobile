import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../components';

interface WelcomeProps { }

const Welcome = (props: WelcomeProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.topButton}>
				<Button type="border" color="white" onPress={() => navigate(props.router, '/auth?content=register')}>
					Create new account
				</Button>
			</View>
			<View>
				<Button type="filled" color="white" onPress={() => navigate(props.router, '/auth?content=login')}>
					Enter
				</Button>
			</View>
		</View>
	);
};

function navigate( router, route ){
	router.navigate( route );
}

export default Welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	
	topButton: {
		marginBottom: 20
	}
});
