
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, View } from 'native-base';

import navigateTo from '../../actions/sideBarNav';

import styles from './styles';

class Footer extends Component {

  static propTypes = {
    navigateTo: React.PropTypes.func,
  }

  constructor(props){
    super(props);

    this.state = {
      current: 'home'
    }
  }

  navigateTo(route) {
    //this.props.navigateTo(route, 'home');
    // try to mimic navigation
    this.setState({current: route})

  }

  getStyle(name){

    return this.state.current == name ? styles.bgColor: styles.fgColor;
  }

  render() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={._assign({},styles.button, this.getStyle('home'))} onPress={() => this.navigateTo('home')}>
          <Icon name="ios-home-outline" />
        </TouchableOpacity>
        <TouchableOpacity style={._assign({},styles.button, this.getStyle('messages'))} onPress={() => this.navigateTo('messages')}>
          <Icon name="ios-chatbubbles-outline" />
        </TouchableOpacity>
        <TouchableOpacity style={._assign({},styles.button, this.getStyle('finder'))} onPress={() => this.navigateTo('finder')}>
          <Icon name="ios-compass-outline" />
        </TouchableOpacity>
        <TouchableOpacity style={._assign({},styles.button, this.getStyle('contacts'))} onPress={() => this.navigateTo('contacts')}>
          <Icon name="ios-man-outline" />
        </TouchableOpacity>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});


export default connect(mapStateToProps, bindAction)(Footer);
