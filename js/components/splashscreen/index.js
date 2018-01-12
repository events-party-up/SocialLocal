
import React, { Component } from 'react';
import { View} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {Image } from 'react-native'

const launchscreen = require('../../../images/social-logo.png');

  const {
    pushRoute,
    replaceAt
  } = actions;


export class SplashPage extends Component {

  static propTypes = {
    navigator: React.PropTypes.shape({}),
  }

  replaceAt(route) {
    this.props.replaceAt('splashscreen', { key: route }, this.props.navigation.key);
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, index: 0 }, this.props.navigation.key);
  }

  componentWillMount() {

    setTimeout(() => {
      this.replaceAt('login')}
    , 1500);
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <Image source={launchscreen} style={{ flex: 1, height: null, width: null, resizeMode:'contain' }} />
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = (state) => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(SplashPage)
