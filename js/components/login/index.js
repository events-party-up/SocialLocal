import React, { Component } from 'react';
import { Image, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, Header, Title, InputGroup, Input, Button, Icon, View } from 'native-base';
import { signInWithGmail, _signOut, signInUser,  resetPassword, resetUser } from '../../actions/login';
import { startAuthListener } from '../../actions/listeners';
import AnimatedButton from '../misc/AnimatedButton'

import myTheme from '../../themes/base-theme';
import login from './login-theme';
import styles from './styles';

const backgroundImage = require('../../../images/social-logo.png');
const logo = require('../../../images/social-logo.png');
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { _setupGoogleSignin } from '../../helpers/google';

import ForgotPassword from './forgotpassword';
import _ from 'lodash'
import {showError, closeError } from '../../actions/error';
import FormInput from '../inputs';
import SplashScreen from 'react-native-splash-screen'

const {
  pushRoute,
  replaceAt,
  popRoute,
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

  constructor(props) {

    super(props);
    this.state = {
      email: '',
      password: '',
      fields: []
    };


  }

  replaceAt(route) {
    
    //this.props.pushRoute({ key: route, type: 'modal' }, this.props.navigation.key);
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  resetHome(){
    this.firebase && this.firebase();
    const routes = [ {key: 'home'} ]
    this.props.reset(routes, this.props.navigation.key, 0);
    
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, type: 'modal' }, this.props.navigation.key);
  }

  componentDidUpdate(prevProps, prevState){
    // if there is a change in login and erro
    // check only if current route is login
    if( this.props.navigation.routes[this.props.navigation.index].key === 'login' && 
      prevProps.login !== this.props.login && 
        this.props.login.authenticated === true &&
        this.props.login.user !== null &&
        this.props.login.user.verifyPhone === true
      ){
      this.resetHome();
    }
  }

  componentDidMount(){
    _setupGoogleSignin.bind(this)();
    // start Auth listener

    this.props.startAuthListener(this)
    SplashScreen.hide();
  }

  componentWillUnmount(){
    this.firebase && this.firebase();
  }

  doResetPassword(){
    this.pushRoute('forgot')
    //this.fp.openModal();
    //resetPassword(this.state);
    //Alert.alert('Forgot Password', 'Please check your email for password reset');
  }

  loginUsingGmail(){
    this.props.signInWithGmail();
  }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

  handleSubmit(){
    let validForm = true;
    let atleastOneTrue = false;

    
    this.state.fields.forEach((field) => {
      
      if(typeof field.validate === 'function'){
        let validField = field.validate()
        
        validForm = validForm & validField
        atleastOneTrue = atleastOneTrue || field.state.input !== ''
      }
    })
    
    if(validForm && atleastOneTrue){
      this.props.signInUser(this.state);
    }else{
      this.props.showError('Please fill up the form')
    }
  }

  render() {  // eslint-disable-line class-methods-use-this

    return (
      <Container style={styles.container}>
        <Content scrollEnabled={true} keyboardShouldPersistTaps="always">
          <View style={styles.bg}>
            <FormInput style={styles.input}
              icon="ios-at-outline"
              placeholder="EMAIL"
              onChangeText={email => this.setState({ email })}
              ctype='email'
              onComponentMounted={(val) => this.register(val)}
              keyboardType='email-address'
              />

            <FormInput style={styles.input}
              icon="ios-unlock-outline"
              placeholder="PASSWORD"
              onChangeText={password => this.setState({ password })}
              ctype='password'
              secureTextEntry={true}
              multiline={false}
              keyboardType='password'
              onComponentMounted={(val) => this.register(val)}
              />
          </View>
          <Button transparent onPress={() => this.doResetPassword()}
            style={{ alignSelf: 'flex-end', marginBottom: (Platform.OS === 'ios') ? 5 : 0, marginTop: (Platform.OS === 'ios') ? -10 : 0 }}>
            <Text> Forgot Password </Text>
          </Button>

          <Button rounded success small style={styles.button} buttonState={"stop"} onPress={() => this.handleSubmit()}>
            <Text style={styles.buttonText}> LOGIN </Text>
          </Button>

          <AnimatedButton rounded success small style={styles.button} onPress={() => this.loginUsingGmail()} title="G-MAIL" />
          <Text style={{ alignSelf: 'center', marginTop: 100, marginBottom: 30 }}> Dont have an account yet ? </Text>

          <Button info style={styles.signup} onPress={() => this.pushRoute('signUp')}>
          <Text style={{color: '#FFF'}}>SIGN UP! </Text>
          </Button>
                  
        </Content>
            
      </Container >
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    reset: (routes, key, index) => dispatch(reset(routes, key, index)),
    signInWithGmail: () => dispatch(signInWithGmail.bind(this)()),
    _signOut: () => dispatch(_signOut.bind(this)()),
    startAuthListener: (base) => dispatch(startAuthListener.bind(this)(base)),
    signInUser: ({email, password}) => dispatch(signInUser.bind(this)(email, password)),
    popRoute: (key) => dispatch(popRoute(key)),
    resetUser: () => dispatch(resetUser.bind(this)()),
    showError: (msg) => dispatch(showError(msg)),
    closeError: () => dispatch(closeError())
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  current: state.cardNavigation.index,
  login: state.login
});

export default connect(mapStateToProps, bindActions)(Index);
