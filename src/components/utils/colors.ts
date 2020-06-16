import memoize from 'memoize-one';

export function hashCode(str) { // java String#hashCode
	if (!str) return 0;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

export function intToRGB(i) {
	let c = (i & 0x00AAAAAA)
		.toString(16)
		.toUpperCase()
	;

	return "00000".substring(0, 6 - c.length) + c;
}

function padZero(str, len = 2) {
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

export const invertColor = memoize( function invertColor(hex: string, blackAndWhite: boolean = true) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}

	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}

	let r:any = parseInt(hex.slice(0, 2), 16);
	let g:any = parseInt(hex.slice(2, 4), 16);
	let b:any = parseInt(hex.slice(4, 6), 16);
	
	if (blackAndWhite) {
		// http://stackoverflow.com/a/3943023/112731
		return (r * 0.299 + g * 0.587 + b * 0.114) > 186
			? '#000000'
			: '#FFFFFF'
		;
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);

	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
});