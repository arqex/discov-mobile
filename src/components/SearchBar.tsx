import * as React from 'react';
import { Animated, View, StyleSheet, Keyboard } from 'react-native';
import Button from './Button';
import Input from './Input';
import styleVars from './styleVars';
import interpolations from './utils/scrollInterpolation';
import nofn from '../utils/nofn';
import BackButtonHandler from '../utils/BackButtonHandler';

const ANIM_DURATION = 300;

interface SearchBarProps {
  onSearch: (text: string) => void,
  onOpen: () => void,
  onClose: () => void,
  onQueryChange: (text:string) => void,
  preButtons?: any,
  animatedScrollValue?: Animated.Value
}

export default class SearchBar extends React.Component<SearchBarProps> {
  animatedOpen = new Animated.Value(0)
  circleInterpolation: Animated.AnimatedInterpolation

  animatedOpacity = interpolations.interpolateTo1(
    this.props.animatedScrollValue || new Animated.Value(499)
  )

  static defaultProps = {
    onSearch: nofn,
    onClose: nofn,
    onOpen: nofn,
    onQueryChange: nofn
  }

  state = {
    searching: false,
    text: ''
  }

  constructor( props ) {
    super( props );

    this.circleInterpolation = this.animatedOpen.interpolate({
      inputRange: [0, 1],
      outputRange: [.1, 20]
    });
  }

  render() {
    let circleStyles = [
      styles.circle,
      { transform: [{scale: this.circleInterpolation}]}
    ];

    let closedContentStyles = [
      styles.closedContent,
      this.state.searching && styles.closedContentDisabled
    ]

    let searchBarStyles = [
      styles.searchBar,
      this.state.searching && styles.searchBarActive,
      { opacity: this.animatedOpen }
    ];

    return (
      <View style={ styles.container }>
        <View style={ closedContentStyles }>
          <View>
            { this.props.preButtons }
          </View>
          <Animated.View style={{marginLeft: 5, opacity: this.animatedOpacity}}>
            { this.props.children }
          </Animated.View>
        </View>
        <Animated.View style={ searchBarStyles }>
          <Animated.View style={ circleStyles } />
          <View style={ styles.searchContent }>
            <Button type="icon"
              icon="arrow-back"
              color="secondary"
              onPress={ this._endSearch } />
            <View style={ styles.inputWrapper }>
              <Input ref="input"
                value={ this.state.text }
                color={ styleVars.colors.blueText }
                onSubmitEditing={ this._onSearch }
                style={{height: 38}}
                onChangeText={ this._onQueryChange } />
            </View>
          <Button type="icon"
            icon="search"
            color="secondary"
            onPress={ this._onSearch } />
          </View>
        </Animated.View>
        <View style={ styles.searchControl }>
          <Button type="icon"
            icon="search"
            color="secondary"
            onPress={ this._startSearch } />
        </View>
      </View>
    );
  }

  _startSearch = () => {
    if( this.state.searching ) return;

    //@ts-ignore
    this.refs.input && this.refs.input._clear();
    this.props.onOpen();
    this.setState({searching: true}, () => {
      this.searchOpen();
    });
  }

  _endSearch = () => {
    if( !this.state.searching ) return;

    this.searchClose();
    this.props.onClose();
    setTimeout( () => {
      Keyboard.dismiss();
      this.setState({searching: false});
    }, ANIM_DURATION);
  }

  _onSearch = () => {
    if( !this.state.text ) return;

    this.props.onSearch( this.state.text );
  }

  _onQueryChange = text => {
    this.setState({ text });
    this.props.onQueryChange( text );
  }

  componentDidUpdate( prevProps, prevState ) {
    if( !prevState.searching && this.state.searching ){
      this.searchOpen();
    }
    else if( prevState.searching && !this.state.searching ){
      this.searchClose();
    }
  }

  searchOpen() {
    Animated.timing( this.animatedOpen, {
      toValue: 1,
      duration: ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }

  searchClose() {
    Animated.timing( this.animatedOpen, {
      toValue: 0,
      duration: ANIM_DURATION,
      useNativeDriver: true
    }).start();
  }
  
  _onBackPress = () => {
		if( this.state.searching ){
			this._endSearch();
			return true;
		}
		return false;
  }
  
  componentDidMount() {
		BackButtonHandler.addListener( this._onBackPress );
  }

  componentWillUnmount() {
		BackButtonHandler.removeListener( this._onBackPress );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    paddingLeft: 5,
    paddingRight: 6
  },
  closedContent: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  closedContentDisabled: {
    opacity: 0
  },
  searchBar: {
    position: "absolute",
    top: 0, left: 5,
    width: '100%',
    height: '100%',
    zIndex: -1,
    opacity: 1,
    overflow: 'hidden'
  },

  searchBarActive: {
    zIndex: 1
  },

  searchControl: {

  },

  circle: {
    width: 60, height: 60,
    // backgroundColor: '#fff',
    borderRadius: 30,
    position: 'absolute',
    top: -10, right: -10
  },
  searchContent: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputWrapper: {
    flexGrow: 1,
    transform: [{translateY: 1}]
  }
})