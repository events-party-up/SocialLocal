import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';


/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');

/* Configuration */
const {
    pushRoute,
    popRoute
} = actions;

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
        this.props.pushRoute({ key: route, type: 'normal'}, this.props.navigation.key)
    }

    popRoute(route){
        this.props.popRoute(this.props.navigation.key);
    }
    
    onSubmit(){

    }

handleSubmit(){
        let validForm = true;
        let atleastOneTrue = false;

        let allPromises = []
        this.state.fields.forEach((field) => {
      
        if(typeof field.validate === 'function'){
            allPromises.push(field.validate())
        }
            atleastOneTrue = atleastOneTrue || field.state.input !== ''
        })
        const {email, password} = this.state;
        Promise.all(allPromises)
            .then(() => {if(!atleastOneTrue) throw new Error('Blank Input')})
            .then(() => {this.props.onSubmit()})
            .catch((error) => this.props.showError(error.message))
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

    renderContent1(){
        return(
        <View style={baseStyle.bg}>
           <FormInput style={styles.input}
              
              placeholder="Username"
              onChangeText={input => this.setState({ input })}
              ctype='email'
              onComponentMounted={(val) => this.register(val)}
              title='E-MAIL ADDRESS, PHONE NUMBER OR USERNAME'
              />
             
              
              <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 58})} onPress={() => this.handleSubmit()}>
                <Text style={baseStyle.buttonText}> Search </Text>
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
             <Header>
                <Button transparent onPress={() => this.popRoute()}>
                <CustomIcon name='arrow-back' size={26} color='#9B9B9B'/>
                </Button>

                <Title>Sign Up</Title>

              </Header>
              
                <Content style={{backgroundColor:'#FFF'}}>
                <View style={baseStyle.line}/>
                <Image source={glow2} style={baseStyle.container}>
                    <SProgressBar progress={0.2} />
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
    navigation: state.cardNavigation
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key))
    }
}

export default connect(mapStateToDispatch, bindActions)(Forgot)