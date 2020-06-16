import * as React from 'react';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import styleVars from './styleVars';

const sizes = {
	m: { width: 30, height: 45 },
	s: {width: 20, height: 30 },
	xs: { with: 10, height: 15 }
}

const colors = {
	dark: { circle: "#FF4D55", path: "#313140" },
	light: { circle: "#FF4D55", path: "#EEE" },
	gray: { circle: styleVars.colors.lightText, path: styleVars.colors.lightText },
}

export default function MarkerShadow( props ){
	let color = colors[ props.color ] || colors.dark;
	let size = sizes[ props.size ] || sizes.m;

	return (
		<Svg width="100%" height="100%" viewBox="0 0 160 80">
			<Defs>
				<RadialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="50%" id="a">
					<Stop stopOpacity=".6" offset="0%" />
					<Stop stopOpacity="0" offset="100%" />
				</RadialGradient>
			</Defs>
			<Ellipse cx="80" cy="40" rx="80" ry="40" fill="url(#a)" fillRule="evenodd" />
		</Svg>
	);
}

