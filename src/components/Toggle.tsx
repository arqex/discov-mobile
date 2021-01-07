import React, { Component } from 'react'
import { Switch } from 'react-native'
import styleVars from './styleVars'

interface ToggleProps {
	disabled?: boolean,
	value: boolean,
	onValueChange: (value: boolean) => any
}

export default class Toggle extends Component<ToggleProps> {
	
	render() {
		let {primary, borderBlue} = styleVars.colors;
		return (
			<Switch
				trackColor={{ false: borderBlue, true: borderBlue }}
				thumbColor={this.props.value ? primary : '#b2b6be'}
				ios_backgroundColor="#5e5"
				value={ this.props.value }
				onValueChange={ this.props.onValueChange }
			/>
		)
	}
}