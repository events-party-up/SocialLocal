import React, {Component} from 'react';

/* Open source modules */
import {View, Image, Text, TouchableHighlight} from 'react-native'
import { Container, Content,  Button, Header ,Icon, Title} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');

/* Custom components */
import FormInput from '../inputs';
import { signInUser,signInWithGmail,showError, pushRoute, popRoute} from '../../actions/login';

import { _setupGoogleSignin } from '../../helpers/google';
import { startAuthListener } from '../../actions/listeners';

/* Component class */

class NewLogin extends Component{

  constructor(props){
      super(props);
      this.state ={
          email: '',
          password: '',
          fields: []
      }
      
  }
  pushRoute(route){
      this.props.pushRoute({ key: route})
  }

  resetHome(){
      this.firebase && this.firebase();
      const routes = [ {key: 'home'} ]
      this.props.reset(routes, this.props.navigation.key, 0);
  }

  popRoute(route){
      this.props.popRoute();
  }

  handleSubmit(){
      let validForm = true;
      let atleastOneTrue = false;

      let allPromises = []
      this.state.fields.forEach((field) => {
    
      if(typeof field.validate === 'function'){
          allPromises.push(field.validate())
          }
      })
      Promise.all(allPromises)
          .then(() => this.props.signInUser(this.state))
          .catch((error) => this.props.showError({message:"Invalid username and password. Please verify again.", title:'Login Error'}))
  }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

  

  renderContent1(){
        return(
        <View style={styles.bg}>
            
            <FormInput style={_.assign({}, {paddingLeft: 1})}
              icon="ios-at-outline"
              onChangeText={email => this.setState({ email })}
              ctype='login_email'
              onComponentMounted={(val) => this.register(val)}
              title='E-mail Address'
              keyboardType='email-address'
              autoFocus={true}
            />
              
            <FormInput style={_.assign({}, {paddingLeft: 1})}
              icon="ios-unlock-outline"  
              onChangeText={password => this.setState({ password })}
              ctype='input'
              secureTextEntry={true}
              multiline={false}
              onComponentMounted={(val) => this.register(val)}
              title='Password'
            />
              
            <Button primary rounded style={Object.assign({},styles.normalButton,{marginTop: 58})} onPress={() => this.handleSubmit()}>
                <Text style={styles.buttonText}> Log In </Text>
            </Button>
            
            <View style={{alignItems:'center',marginTop: 20, height: 60, justifyContent:'space-between'}}>
            <TouchableHighlight onPress={()=> this.pushRoute('forgot')}>
                <Text style={Object.assign({},styles.regulartext,{color:'#5F7EFE'})}> Forgot Password? </Text>
                </TouchableHighlight>
            <TouchableHighlight onPress={() => this.props.signInWithGmail()}>
                <Text style={Object.assign({},styles.regulartext,{color:'#5F7EFE'})}> Continue with Google </Text>
            </TouchableHighlight>
            </View>
        </View>
        );
    }



    render(){
        return(
        <Container theme={theme}>
              <View style={styles.line}/>
                <Image source={glow2} style={styles.container}>
                    <View style={{ flex:1, justifyContent: 'flex-end' }}>
                      {this.renderContent1()}
                    </View>
                </Image>
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         signInUser: ({email, password}) => dispatch(signInUser(email, password)),
         showError: (msg) => dispatch(showError(msg)),
         startAuthListener: (base) => dispatch(startAuthListener(base)),
         reset: (routes, key, index) => dispatch(reset(routes, key, index)),
         signInWithGmail: () => dispatch(signInWithGmail()),
    }
}

export default connect(mapStateToDispatch, bindActions)(NewLogin)