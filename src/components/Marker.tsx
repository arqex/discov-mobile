import * as React from 'react';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
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
	lightBlue: { circle: styleVars.colors.borderBlue, path: styleVars.colors.borderBlue }
}

export default function Marker( props ){
	let color = colors[ props.color ] || colors.dark;
	let size = sizes[ props.size ] || sizes.m;

	return (
		<Svg width={ size.width }
			height={ size.height }
			viewBox="0 0 333 488">
			<G fill="none" fillRule="evenodd">
				<Path fill={ color.path } d="M0 142.61v44.64h39.82L141.88 487.4h49.23l101.85-300.15h39.1V142.6H280.2l-40.76 44.64-73.41 237.18-72.78-237.18-41.02-44.64z" />
				<Circle fill={ color.circle } cx="166.34" cy="87.5" r="87.5" />
			</G>
		</Svg>
	);
}

