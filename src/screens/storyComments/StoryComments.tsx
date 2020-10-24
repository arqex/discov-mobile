import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface componentNameProps {}

const componentName = (props: componentNameProps) => {
	return (
		<View style={styles.container}>
			<Text>This is the comments screen</Text>
		</View>
	);
};

export default componentName;

const styles = StyleSheet.create({
	container: {}
});
