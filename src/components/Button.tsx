import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Spinner from './Spinner';
import styleVars from './styleVars';

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;


type ButtonSizes = 'm' | 's';
type ButtonColors = 'primary' | 'secondary' | 'white';
type ButtonTypes = 'filled' | 'border' | 'transparent' | 'icon' | 'iconFilled' | 'menu' ;
type IconPositions = 'pre' | 'post';

interface ButtonProps {
	type?: ButtonTypes,
	size?: ButtonSizes,
	color?: ButtonColors,
	icon?: string,
	iconPosition?: IconPositions,
	iconColor?: string,
	withShadow?: boolean
	[others: string]: any
}

const colors = styleVars.colors;

let router;

const Button = (props: ButtonProps) => {
	const {type, size, color, icon, iconPosition, disabled, loading, onPress, link, withShadow,...others} = props;

	const isIcon = type === 'icon' || type === 'iconFilled';

	const isMenuButton = type === 'menu';

	const containerStyles = [
		styles.container,
		styles[ `size_${size}` ],
		styles[ `${type}_${color}` ],
		isMenuButton && styles.container_menu,
		disabled && styles.disabled,
		isIcon && styles.iconContainer,
		withShadow && styles.shadow
	];

	const textStyles = [
		styles.text,
		styles[`text_${type}_${color}`],
		isMenuButton && styles.text_menu
	];
	
	const iconSize = isMenuButton ? 32 : 24;

	let content;
	if( isIcon ){
		content = (
			<MaterialIcons name={ props.icon } size={ iconSize } color={ getIconColor( props ) } />
		);
	}
	else {
		let iconPre, iconPost;
		if( props.icon ){
			let icon = <MaterialIcons name={props.icon} size={iconSize} color={ getIconColor(props) } />;
			if( props.iconPosition === 'pre' ){
				iconPre = <View style={ [styles.iconWrapperPre , isMenuButton && styles.iconWrapper_pre]}>{ icon }</View>;
			}
			else {
				iconPost = <View style={[styles.iconWrapperPost, isMenuButton && styles.iconWrapper_post]}>{icon}</View>;
			}
		}
		content = (
			<View style={[styles.textWrapper,	loading && styles.textLoading] }>
				{iconPre}
				<Text style={textStyles}>
					{props.children}
				</Text>
				{iconPost}
			</View>
		);
	}

	let spinner;
	if( loading ){
		spinner = (
			<View style={styles.spinner}>
				<Spinner color={ getIconColor(props) } />
			</View>
		);
	}

	const linkedPress = e => {
		if( link ){
			router.navigate( link );
		}
		return onPress( e );
	}

	return (
		<Touchable
			disabled={ disabled }
			{...others}
			onPress={ linkedPress }>
			<View style={containerStyles}>
				{ content }
				{ spinner }
			</View>
		</Touchable>
	);
};

Button.setRouter = function( r ){
	router = r;
}

Button.defaultProps = {
	type: 'filled',
	color: 'primary',
	size: 'm',
	icon: '',
	iconPosition: 'pre',
	onPress: function(){}
};

export default Button;

function getIconColor( props ){
	let { type, color, iconColor } = props;

	if( iconColor ){
		return iconColor
	}
	
	if (type === 'icon') {
		return colors[color];
	}
	return color === 'white' ? colors.secondary : colors.white;
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 21,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: 'transparent',
		textTransform: 'uppercase',
		paddingLeft: 15,
		paddingRight: 15
	},

	container_menu: {
		backgroundColor: 'transparent',
		height: 52
	},

	disabled: {
		opacity: .6
	},

	textWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	text: {
		fontWeight: 'bold',
		fontSize: 15,
		textTransform: 'uppercase'
	},

	size_m: {
		height: 46
	},

	size_s: {
		height: 32
	},

	filled_primary: {
		backgroundColor: colors.primary
	},
	text_filled_primary: {
		color: colors.white
	},
	filled_secondary: {
		backgroundColor: colors.secondary,
	},
	text_filled_secondary: {
		color: colors.white
	},
	filled_white: {
		backgroundColor: colors.white,
	},
	text_filled_white: {
		color: colors.secondary
	},
	border_primary: {
		borderColor: colors.primary
	},
	text_border_primary: {
		color: colors.primary
	},
	border_secondary: {
		borderColor: colors.secondary
	},
	text_border_secondary: {
		color: colors.secondary
	},
	border_white: {
		borderColor: colors.white
	},
	text_border_white: {
		color: colors.white
	},
	text_menu: {
		fontWeight: '400',
		fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
		color: colors.blueText,
		fontSize: 20,
		textTransform: 'none'
	},
	transparent_primary: {
		paddingLeft: 5,
		paddingRight: 5
	},
	text_transparent_primary: {
		color: colors.primary,
		textTransform: 'none'
	},
	transparent_secondary: {
		paddingLeft: 5,
		paddingRight: 5
	},
	text_transparent_secondary: {
		color: colors.secondary,
		textTransform: 'none'
	},
	transparent_white: {
		paddingLeft: 5,
		paddingRight: 5
	},
	text_transparent_white: {
		color: colors.white,
		opacity: .9,
		textTransform: 'none'
	},
	iconContainer: {
		width: 42,
		height: 42,
		paddingLeft: 5,
		paddingRight: 5
	},
	iconFilled_primary: {
		backgroundColor: colors.primary
	},
	iconFilled_secondary: {
		backgroundColor: colors.secondary
	},
	iconFilled_white: {
		backgroundColor: colors.white
	},
	iconWrapperPre: {
		marginRight: 5
	},
	iconWrapperPost: {
		marginLeft: 5
	},
	iconWrapper_pre: {
		marginRight: 10
	},
	iconWrapper_post: {
		marginLeft: 10
	},
	textLoading: {
		opacity: 0
	},
	spinner: {
		position: 'absolute'
	},
	shadow: {
		borderWidth: 1,
		borderColor: styleVars.colors.borderBlue
	}
});
