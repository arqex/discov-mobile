import * as React from 'react';
import { View } from 'react-native';
import styleVars from './styleVars';
import Text from './Text';

export default function LoadingText( props ){
	let color = styleVars.colors.borderBlue;

	return (
		<View style={{backgroundColor: color, borderRadius: 2}}>
			<Text color={ color } type={ props.type }>
				{ props.children }
			</Text>
		</View>
	);
}