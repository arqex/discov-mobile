import { Animated } from 'react-native';

export function animatedStyles( transition, indexes, layout ){
	let styles = typeof transition.styles === 'function' ? transition.styles( indexes, layout ) : transition.styles;
	if( !styles ){
		styles = {}
	}

	let animatedStyles = {}
	let transformStyles = []

	if( indexes.count ){
		animatedStyles.zIndex = indexes.count - Math.abs(indexes.relative)
	}

	Object.keys( styles ).forEach( key => {
		let value = styles[key];

		if( styleKeys[key] ){
			if( warnKeys[key] ){
				console.warn(`react-urlstack: It's possible in web, but react-native won't animate the property "${key}"`)
			}
			if( value && value.inputRange ){
				animatedStyles[ key ] = indexes.transition.interpolate( value )
			}
			else {
				animatedStyles[ key ] = value
			}
		}
		else if( transformKeys[key] ){
			// Check values
			let type = transformKeys[key];
			let warned = false;
			if( value && value.outputRange ){
				styles[key].outputRange.forEach( value =>{
					if( !warned && typeof value !== type ){
						warned = true;
						console.warn(`react-urlstack: Even if it works in web, react-native only accepts type "${transformKeys[key]}" for "${key}". Given "${ value }".`);
					}
				})

				transformStyles.push({
					[key]: indexes.transition.interpolate( value )
				})
			}
			else {
				transformStyles.push({
					[key]: value
				})
			}
		}
		else {
			console.warn(`react-urlstack: Unknown property to animate "${key}"`)
		}
	})

	if( transformStyles.length ){
		animatedStyles.transform = transformStyles
	}

	return animatedStyles
}


let styleKeys = {};
let warnKeys = {};
['left', 'right', 'top', 'bottom'].forEach( key => {
	styleKeys[key] = 1;
	warnKeys[key] = 1;
});
['width', 'height', 'opacity', 'backgroundColor', 'borderRadius'].forEach( key => {
	styleKeys[key] = 1 
})

let n = 'number', s = 'string';
let transformKeys = {
	perspective: n,
	rotate: s, rotateX: s, rotateY: s, rotateZ: s,
	scale: n, scaleX: n, scaleY: n,
	translateX: n, translateY: n,
	skeyX: s, skewY: s
};


export function stagger( animatedValue, gap, times, styles ){
	let follower = new Animated.Value( animatedValue._value );
	Animated.timing( follower, {duration: 0, toValue: animatedValue} ).start();
	
	let stagged = [ animatedStyles({styles}, {transition: follower}) ];

	for( let i = 1; i < times; i++ ){
		let stage = {};
		Object.keys( styles ).forEach( attr => {
			let val = styles[attr];
			if( val && val.inputRange ){
				let shifted = {
					inputRange: [],
					outputRange: val.outputRange
				}
				val.inputRange.forEach( inputValue => {
					shifted.inputRange.push( inputValue + (i * gap) )
				})
				stage[attr] = shifted;
			}
			else {
				stage[attr] = val;
			}
		})

		let animated = animatedStyles({styles: stage}, {transition: follower});
		stagged.push( animated );
	}

	return stagged;
}