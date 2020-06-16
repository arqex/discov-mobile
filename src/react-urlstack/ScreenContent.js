import React, { Component } from 'react'

export default class ScreenContent extends Component {
	render() {
		return this.props.renderScreen();
	}

	shouldComponentUpdate(){
		return !this.props.animating;
	}
}
