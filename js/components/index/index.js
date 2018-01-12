
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, View, Text, Button } from 'native-base';
import { _signOut} from '../../actions/login';
import { AlertIOS } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import navigateTo from '../../actions/sideBarNav';
import myTheme from '../../themes/base-theme';

import {AnimatedButton} from 'native-base';
import {Animated, Image, Easing, StyleSheet } from 'react-native';
const {
  pushRoute,
  replaceAt,
  reset,
} = actions;

class Index extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props){
    super(props);

    this.spinValue = new Animated.Value(0)
    this.animatedValue = new Animated.Value(0)

    this.logIn = this.logIn.bind(this)
    this.state ={
      buttonState : 'idle'
    }
  }
  replaceAt(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }

  reset(route){

    this.props.reset([{key: route, index: 0}], this.props.navigation.key, 0);
  }

  componentDidMount(){
    this.spin();
  }

  spin(){
    this.spinValue.setValue(0);

    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  logout(){
    this.props._signOut();
    //this.props.navigateTo('login','home');
    this.replaceAt('login');
    // don't check for errors and move to login page
    //this.reset('login');
  }

  logIn() {
    let time = 2000;
    return new Promise(function(fulfill, reject){
      setTimeout(fulfill, time);
    });
}

  render() {  // eslint-disable-line class-methods-use-this

    const spin = this.spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
})
    return (
      <Container style={styles.container}>
        <View>
          <Grid>
            <Row style={{justifyContent: 'center'}}>
              <Button style={{alignSelf:'center'}}><Text> hello world</Text></Button>
            </Row>
            <Row style={{justifyContent: 'center'}}>

            </Row>
          </Grid>

      </View>

    </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    reset: (routes, key , index) => dispatch(reset(routes, key , index)),
    _signOut: () => dispatch(_signOut()),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  current: state.cardNavigation.index,
  login: state.login
});

export default connect(mapStateToProps, bindActions)(Index);

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  loginButtonBackground: {
    flex: 1,
    height: 40,
    borderRadius: 5
  },
  loginButtonLabel: {
    color: 'white'
  }
};
