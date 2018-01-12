import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title, Radio,Left} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';
import BEMCheckBox from 'react-native-bem-check-box';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {resetPassword, showError, resetRoute,pushRoute} from '../../actions/login'

import styles from './styles';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');

/* Component class */

class ForgotPasswordConfirmation extends Component{

    constructor(props){
        super(props);
        this.state = {
            input: '',
            fields: []
        }
    }

    pushRoute(route){
        this.props.pushRoute({ key: route });
    }
    onSubmit(){
      this.props.resetPassword({email: this.props.email})
        .then(()=> Actions.passwordSent({email: this.props.email}) )
        .catch((error)=> this.props.showError({message: error.message, title:'RECOVERY Error!'}))
    }

handleSubmit(){

  this.onSubmit();
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

    renderContent1(){
        return(
        <View >
          <Text style={styles.forgetPasswordText} >The following credentials are  associated with your account</Text>
          <View style={{height:1,backgroundColor:'#d3d3d3'}} ></View>
          <View style={{flexDirection: 'row',alignItems: 'center',alignSelf:'center',marginTop:20}} >
            <BEMCheckBox
              style={styles.checkbox}
              tintColor='#5F7EFE'
              onFillColor='#5F7EFE'
              onTintColor='#5F7EFE'
              onCheckColor='#FFF'
              size='10'
              value={true}
              disabled={true}
              />
            <Text style={{alignSelf:'center',fontFamily:'worksans-regular', fontSize: 12}} > Email a link to {this.props.email} </Text>
          </View>      
          <Button primary rounded style={Object.assign({},styles.blueButton,{marginTop: 58,width:200,justifyContent: 'center'})} onPress={() => this.handleSubmit()}>
            <Text style={baseStyle.buttonText}> Continue </Text>
          </Button>
            
        </View>
        );
    }

    renderContent2(){
        return(
        <View style={baseStyle.bg}>
            <Text> Content 2 </Text>
        </View>
        );
    }
    

    render(){
        return(
        <Container theme={theme}>
                <Content style={{backgroundColor:'#FFF'}} keyboardShouldPersistTaps="always">
                <View style={baseStyle.line}/>
                <Image source={glow2} style={baseStyle.container}>
                    
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                        {this.renderContent1()}
                    </View>
                    
                </Image>
                </Content>
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
})

function bindActions(dispatch) {
    return {
         
         resetPassword: (user) => dispatch(resetPassword(user)),
         showError: (msg) => dispatch(showError(msg)),
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),

    }
}


export default connect(mapStateToDispatch, bindActions)(ForgotPasswordConfirmation)