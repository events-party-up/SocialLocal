import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import  {showError, resetRoute,pushRoute} from '../../actions/login'

import styles from './styles';


const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');

/* Component class */

class Forgot extends Component{

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
    // onSubmit(){
    //   this.props.resetPassword({email: this.state.input})
    //     .then(()=>this.props.showError({
    //         message:'Email sent! Please check your mailbox.', 
    //         title:'EMAIL SENT', 
    //         callback: this.props.resetRoute('landingpage')}))
    //     .catch((error)=> this.props.showError({message: error.message, title:'RECOVERY Error!'}))
    // }

handleSubmit(){

        let allPromises = []
        this.state.fields.forEach((field) => {
      
        if(typeof field.validate === 'function'){
            allPromises.push(field.validate())
        }
        })

        Promise.all(allPromises)
            .then(() => {Actions.forgotPasswordConfirmation({email: this.state.input})/*this.onSubmit()*/})
            .catch((error) => this.props.showError({ 
                message: error.message,
                title: 'ERROR'
            }))
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

    renderContent1(){
        return(
        <View style={baseStyle.bg}>
           <FormInput style={_.assign({}, baseStyle.input, {paddingLeft: 1})}
              placeholder=""
              onChangeText={input => this.setState({ input })}
              ctype='login_email'
              onComponentMounted={(val) => this.register(val)}
              title='E-mail Address'
              />
              
              <Button primary rounded style={Object.assign({}, styles.blueButton,{marginTop: 58,justifyContent: 'center'})} onPress={() => this.handleSubmit()}>
                <Text style={baseStyle.buttonText}> Reset </Text>
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
         showError: (msg) => dispatch(showError(msg)),
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),

    }
}

export default connect(mapStateToDispatch, bindActions)(Forgot)