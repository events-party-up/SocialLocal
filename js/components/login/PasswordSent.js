import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title, Radio,Left} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {resetPassword, showError, resetRoute, popRoute} from '../../actions/login'

import styles from './styles';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');

/* Component class */

class PasswordSent extends Component{

    constructor(props){
        super(props);
        
    }

    onSubmit(){
        this.props.resetRoute('landingpage');
    }

    handleSubmit(){
        this.props.popRoute('forgotPasswordConfirmation')
    }

  componentWillMount(){
          Actions.refresh({rightTitle: 'Done',onRight: (()=> this.onSubmit())})        
    }

    renderContent1(){
        return(
        <View>
          <Text style={styles.forgetPasswordText} >We’ve sent a link to reset your password at {this.props.email}</Text>
          <Text style={{alignSelf:'center',fontFamily:'worksans-regular',fontSize: 12}} >You should be receiving an email soon</Text>
          <Button transparent style={Object.assign({},{marginTop: 20,alignSelf:'center'})} onPress={() => this.handleSubmit()}>
            <Text style={Object.assign({},styles.regulartext,{color:'#5F7EFE',alignSelf: 'center'})}> Didn’t receive any email? </Text>
          </Button>
            
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
         popRoute: (key) => dispatch(popRoute(key)),
         resetPassword: (user) => dispatch(resetPassword(user)),
         showError: (msg) => dispatch(showError(msg)),
         resetRoute:(key) => dispatch(resetRoute(key))
    }
}

export default connect(mapStateToDispatch, bindActions)(PasswordSent)