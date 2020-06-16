import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ValidateInvitationProps {}

const ValidateInvitation = (props: ValidateInvitationProps) => {
	return (
		<View style={styles.container}>
			<Text>ValidateInvitation</Text>
		</View>
	);
};

export default ValidateInvitation;

const styles = StyleSheet.create({
	container: {}
});
