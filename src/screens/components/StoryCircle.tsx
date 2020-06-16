import * as React from 'react';
import { Circle } from 'react-native-maps';

interface StoryCircleProps {
	center: any,
	radius: any
}

const circleStyles = {
	strokeWidth: 1,
	strokeColor: 'rgba(104, 188, 254, 1)',
	fillColor: 'rgba(104, 188, 254, .3)'
}

export default class StoryCircle extends React.PureComponent<StoryCircleProps> {
	render() {
		return (
			<Circle center={ this.props.center }
				radius={ this.props.radius }
				onLayout={ this._onLayout }
				ref="circle"
				{...circleStyles} />
		);
	}

	_onLayout = () => {
		console.log('Circle in place');
		let circle = this.refs.circle;
		if( circle ){
			console.log('Setting circle native props');
			circle.setNativeProps(circleStyles);
			this.forceUpdate();
		}
	} 
};
