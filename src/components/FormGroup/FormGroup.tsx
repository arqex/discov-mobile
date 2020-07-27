import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import formStyles from './formStyles'
import { MaterialIcons } from '@expo/vector-icons';

/**
 * There are multiple states for a input group.
 * https://material.io/design/components/text-fields.html#filled-text-field
 * 
 * - inactive (default): the input has never been clicked and has no value
 * - active: The input has been clicked, in material design the label moves and let the placeholder appear
 * - focused: the input has the focus
 * - hovered: The cursor is over the input
 * - disabled: The input is not clickable or focusable, and doesn't emit change events
 * - error: There is an error in the input, an error is shown at the bottom.
 * 
 * The input group is composed by multiple parts:
 * - the container
 * - the input
 * - the label
 * - the caption message
 * 
 * All of them can be styled with an object like `containerStyles` that contains styles for the different states:
 * `{default, active, focused, hovered, disabled, error }`
 * Every state style overrides the previous one in the list.
 */

interface FormGroupProps {
	label?: string,
	inputProps?: any,
	caption?: string,
	disabled?: boolean,
	value?: string | number,
	errorLevel?: string,
	whiteText?: boolean,
	type?: 'text' | 'email' | 'password',
	[other:string]: any
}
interface FormGroupState {
	focused: boolean,
	hovered: boolean
}

export default class FormGroup extends PureComponent<FormGroupProps, FormGroupState> {
	static propTypes = {
		containerStyles: PropTypes.object,
		inputStyles: PropTypes.object,
		labelStyles: PropTypes.object,
		captionStyles: PropTypes.object,
		inputProps: PropTypes.object,
	}
	static defaultProps = {
		containerStyles: {},
		inputStyles: {},
		labelStyles: {},
		captionStyles: {},
		inputProps: {},
		color: '#000000',
		type: 'normal'
	}

	id = 'i' + Math.round(Math.random() * 1000000);
	input: any = false

	constructor(props) {
		super(props)
		this.input = props.inputProps.ref || React.createRef();
		this.state = {
			hovered: false,
			focused: false
		}
	}

	render() {
		let states = this.getStates();

		return (
			<View>
				{this.renderLabel(states)}
				{this.renderInputWrapper(states)}
				{this.renderCaption(states)}
			</View>
		)
	}

	renderLabel(states) {
		if (!this.props.label) return;

		let labelProps: any = {
			style: this.getStyles('label', states)
		}

		if (this.isWeb()) {
			labelProps.htmlFor = this.id;
		}

		return (
			<Text {...labelProps}>
				{this.props.label}
			</Text>
		)
	}
	
  renderInputWrapper( states ){
		let original = this.props.inputProps;
    let inputProps = {
			placeholderTextColor: this.props.color,
			...this.getTypeProps(),
			...original,
			style: [ styles[this.props.whiteText ? 'whiteText' : 'blackText'] ],
			value: this.props.value,
			onChangeText: this._onChangeText,
			ref: this.input,
			placeholder: original.placeholder || states.active ? '' : this.props.label,
      onFocus: this._onFocus,
			onBlur: this._onBlur,
			onSubmitEditing: this._onSubmitEditing
    };

    if (this.isWeb()) {
      inputProps.id = this.id;
    }

    return (
			<View style={this.getStyles('input', states)}>
				<View style={styles.inputWrapper}>
					{this.renderInput(inputProps)}
				</View>
				{this.renderClearButton()}
      </View>
    )
	}

	// To be overriden
	renderInput(inputProps){
		return null;
	}

	renderClearButton(){
		if( !this.needClearButton() ) return;

		return (
			<TouchableOpacity onPress={ this._clear } style={ styles.clearButton }>
				<MaterialIcons name="cancel" size={18} color={ this.props.color } />
			</TouchableOpacity>
		);
	}

	renderCaption( states ) {
		if (!this.props.caption) return;

		return (
			<Text style={this.getStyles('caption', states)}>
				{this.props.caption}
			</Text>
		)
	}

	needClearButton() {
		return this.props.value;
	}

	isWeb() {
		return typeof document === 'object';
	}

	getStates() {
		return {
			focused: this.state.focused,
			hovered: this.state.hovered,
			disabled: this.props.disabled,
			active: this.state.focused || !!this.props.value,
			error: this.props.errorLevel
		}
	}

	getStyles(type, states, customStyles?) {
		let propStyles = this.props[type + 'Styles']
		let typeStyles = customStyles || styles;
		let colorStyle: any = {};
		if( type === 'label' || type === 'caption' ){
			colorStyle = { color: this.props.color };
		}
		else if( type === 'input' ){
			colorStyle = { borderBottomColor: this.props.color };
		}

		return [
			typeStyles[type],
			propStyles.default,
			colorStyle,
			states.active && typeStyles[type + 'Active'],
			states.active && propStyles.active,
			states.focused && typeStyles[type + 'Focused'],
			states.focused && propStyles.focused,
			states.hovered && typeStyles[type + 'Hover'],
			states.hovered && propStyles.hover,
			states.error && typeStyles[type + 'Error'],
			states.error && propStyles.error
		]
	}

	getTypeProps(){
		let type = this.props.type;
		if( type === 'email' ){
			return {
				autoCapitalize: 'none',
				autoCompleteType: 'email',
				textContentType: 'emailAddress',
				keyboardType: 'email-address'
			}	
		}
		else if( type === 'password' ){
			return {
				textContentType: 'password',
				secureTextEntry: true
			}
		}

		return {};
	}

	_clear = () => {
		this._onChangeText('');
		this.focus();
	}

	_onFocus = e => {
		this.setState({ focused: true })
		if (this.props.inputProps.onFocus) {
			this.props.inputProps.onFocus(e)
		}
	}

	_onBlur = e => {
		this.setState({ focused: false })
		if (this.props.inputProps.onBlur) {
			this.props.inputProps.onBlur(e)
		}
	}

	_onChangeText = value => {
		this.props.onChangeText && this.props.onChangeText( value );
		let inputChange = this.props.inputProps.onChangeText;
		inputChange && inputChange(value);
	}

	_onSubmitEditing = e => {
		this.props.onSubmitEditing && this.props.onSubmitEditing( e );
	}

	focus() {
		this.input.current && this.input.current.focus();
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch'
	},
	input: {
		flex: 1,
		overflow: 'hidden',
	},
	inputWrapper: {
		flex: 1,
		flexGrow: 1
	},
	clearButton: {
		alignItems: 'center',
		width: 30,
		opacity: .7
	},
	blackText: {
		color: '#111'
	},
	whiteText: {
		color: '#ffffff'
	},

	...formStyles
} as any);