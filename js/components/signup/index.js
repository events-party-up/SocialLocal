import React, {Component} from 'react';

/* Open source modules */
import {View, Image,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';

import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';


/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import FormInput from '../inputs';
import SProgressBar from '../inputs/SProgressBar';

import { signUpUser, pushRoute, syncToStore, popRoute, showError } from '../../actions/login';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const deviceWidth = Dimensions.get('window').width;
const back_arrow  = require('../../../images/Back-Arrow-Black.png');
/* Configuration */

/* Component class */

class SignUp extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            fields: []
        }
    }
    pushRoute(route){
        const {email, password} = this.state;
        this.props.syncToStore({email, password})
        this.props.pushRoute({key: route})
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
            .then(() => this.pushRoute('verifyphone'))
            .catch((error) => this.props.showError({message: error.message, title:'Signup Error'}))
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }
  componentWillMount(){
    Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow })
  }

     renderContent1(){
        return(
        <View style={baseStyle.bg}>
            
             <FormInput style={_.assign({}, baseStyle.input, {paddingLeft: 5})}
              icon="ios-at-outline"
              
              onChangeText={email => this.setState({ email })}
              ctype='email'
              onComponentMounted={(val) => this.register(val)}
              title='E-mail Address'
              autoFocus={true}
              keyboardType='email-address'
              />
               <FormInput style={_.assign({}, baseStyle.input, {paddingLeft: 5})}
              icon="ios-unlock-outline"
              
              onChangeText={password => this.setState({ password })}
              ctype='password'
              secureTextEntry={true}
              multiline={false}
              onComponentMounted={(val) => this.register(val)}
              title='Password'
              />
              
              <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 58, justifyContent: 'center',backgroundColor: '#5F7EFE',borderRadius: 100,width: 300,})} onPress={() => this.handleSubmit()}>
                <Text style={baseStyle.buttonText}> Continue </Text>
            </Button>

        </View>
        );
    }

    

    render(){
        return(
        <Container theme={theme}>
          
              <Content style={{backgroundColor:'#FFF'}}  keyboardShouldPersistTaps="always">
              <View style={{backgroundColor:'#D1D2D1'}} >
                <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth/8)})}/>
              </View>
                <Image source={glow2} style={baseStyle.container}>
                    
                    <View style={{flex:1,justifyContent:'flex-start',paddingTop:60}}>
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
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         signUpUser: (user) => dispatch(signUpUser(user)),
         showError: (msg) => dispatch(showError(msg)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
    }
}

export default connect(mapStateToDispatch, bindActions)(SignUp)