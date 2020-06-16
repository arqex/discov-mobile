import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {Circle, Path, G} from 'react-native-svg';
import styleVars from './styleVars';

interface LogoProps {
	ballColor: string,
	textColor: string,
	size: number
}

const Logo = (props: LogoProps) => {
	let { ballColor, textColor} = props;

	return (
		<Svg width={ props.size } height={ props.size } viewBox="0 0 224 224">
			<Circle fill={ballColor} cx="182.1" cy="125.485" r="20.804" />
			<Path
				fill={textColor}
				d="M40.446 11.131V.638h25.186V116.07h10.494v10.493H53.669l-.63-7.135-.42-.211c-5.876 6.297-12.874 9.445-20.987 9.445-9.517 0-17.072-3.848-22.667-11.543C3.367 109.425.569 99.351.569 86.896c0-13.15 3.358-23.821 10.074-32.006 6.717-8.185 15.391-12.278 26.025-12.278 5.315 0 10.631 1.259 15.95 3.778l.42-.21V11.131H40.446zm12.593 44.914c-5.179-1.958-10.425-2.938-15.741-2.938-7.975 0-13.888 2.624-17.734 7.871-3.85 5.247-5.771 13.399-5.771 24.451 0 10.635 1.712 18.751 5.143 24.346 3.426 5.598 8.709 8.395 15.846 8.395 6.994 0 13.08-2.797 18.259-8.395v-53.73zM87.701 116.428h10.493V55.564H87.701V45.07h23.087v71.358h10.492v10.494H87.701v-10.494zm6.926-90.605c0-2.938.804-5.211 2.413-6.821 1.607-1.607 3.811-2.414 6.611-2.414 2.656 0 4.828.807 6.506 2.414 1.68 1.61 2.52 3.745 2.52 6.401 0 2.801-.84 5.004-2.52 6.611-1.678 1.61-3.918 2.414-6.715 2.414-2.66 0-4.795-.804-6.402-2.414-1.609-1.606-2.413-3.672-2.413-6.191zM59.753 218.435c-6.717 3.496-14.063 5.246-22.037 5.246-11.334 0-20.289-3.637-26.865-10.912C4.273 205.496.988 195.07.988 181.498c0-13.711 3.463-24.451 10.389-32.217s15.914-11.648 26.969-11.648c7.693 0 14.829 1.611 21.408 4.828v20.357H48.629v-12.803c-3.079-1.26-6.856-1.889-11.333-1.889-7.838 0-13.643 2.486-17.42 7.451-3.777 4.967-5.667 12.838-5.667 23.611 0 11.473 2.026 19.938 6.087 25.395 4.057 5.457 9.933 8.186 17.629 8.186 7.556 0 14.83-1.889 21.828-5.668v11.334zM70.911 181.078c0-13.291 3.253-23.854 9.76-31.691 6.506-7.834 14.724-11.754 24.66-11.754 9.934 0 17.871 3.641 23.82 10.914 5.945 7.277 8.92 17.492 8.92 30.643 0 13.432-3.148 24.207-9.445 32.32-6.295 8.115-14.553 12.172-24.764 12.172-10.074 0-18.086-3.883-24.031-11.646-5.949-7.767-8.92-18.083-8.92-30.958zm13.223-1.889c0 11.055 1.783 19.484 5.352 25.289 3.568 5.809 8.709 8.711 15.426 8.711 6.297 0 11.191-2.693 14.691-8.08 3.496-5.385 5.246-13.607 5.246-24.662 0-21.545-6.857-32.32-20.567-32.32-6.578 0-11.579 2.486-15.006 7.451-3.431 4.966-5.142 12.838-5.142 23.611zM200.812 148.275c3.541-2.8 6.166-6.383 8.139-10.494H221.5v10.494h-9.143l-25.605 75.406h-11.963l-24.346-75.406h-9.445v-10.494h14.254c1.973 4.111 4.455 7.694 7.996 10.494l18.258 59.246 19.306-59.246z"
			/>
			<G fill={textColor}>
				<Path d="M155.413 90.464c6.576 2.361 11.402 4.621 14.482 6.771.156.109.291.229.441.342a29.645 29.645 0 0111.764-2.42c1.09 0 2.164.063 3.223.176a18.31 18.31 0 00-4.199-5.999c-3.988-3.784-10.389-7.221-19.203-10.307-6.16-2.23-10.672-4.355-13.537-6.375-2.871-2.02-4.303-4.775-4.303-8.261 0-3.482 1.328-6.306 3.986-8.467 2.656-2.158 6.645-3.24 11.963-3.24 4.756 0 8.744.629 11.965 1.889v11.124h10.912V47.649c-6.998-3.358-14.412-5.037-22.246-5.037-8.537 0-15.531 2.204-20.988 6.611-5.457 4.407-8.186 10.041-8.186 16.895 0 5.178 1.68 9.69 5.037 13.537 3.36 3.85 9.655 7.451 18.889 10.809zM152.337 124.922c0-2.38.287-4.691.814-6.909-3.449-.256-6.686-.83-9.701-1.734v-10.914h-10.912v18.158c6.168 2.903 12.846 4.564 20.023 5.006a30.229 30.229 0 01-.224-3.607z" />
			</G>
		</Svg>
	);
};

Logo.defaultProps = {
	textColor: styleVars.colors.white,
	ballColor: styleVars.colors.primary,
	size: 40
}

export default Logo;

const styles = StyleSheet.create({
	container: {}
});
