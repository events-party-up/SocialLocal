import React, {Component} from 'react';

/* Open source modules */
import SplashScreen from 'react-native-splash-screen'
import {View, Image, Text, TouchableHighlight } from 'react-native'
import { Container, Content, Button } from 'native-base';
import { connect } from 'react-redux';


/* Custom modules */
import { signInWithGmail, pushRoute, resetRoute, popRoute, showError } from '../../actions/login';
import { _setupGoogleSignin } from '../../helpers/google';
import { startAuthListener } from '../../actions/listeners';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/Socialvite_BugMark.png');
const Word_Mark  = require('../../../images/Word_Mark.png');
const splashScreen1 = require('../../../images/splash.png')

/* Component class */
class FirstPage extends Component {

    componentDidMount(){
         //_setupGoogleSignin.bind(this)();
        // start Auth listener

        this.props.startAuthListener(this)
        //SplashScreen.hide();

        // setTimeout (() => {
        //    SplashScreen.hide();
        //}, 4000);
    }


    
    pushRoute(route){
        
        this.props.pushRoute({ key: route });
    }

    resetRoute(route){
        this.props.resetRoute(route)
    }

    onLogin(){
        this.pushRoute('login');
    }

    onCreate(){
        this.pushRoute('signUp');
    }

    getLoginButtons(){
        
        return(
            <View>
                <Button style={styles.roundedButton} onPress={this.props.signInWithGmail}>
                    <Text style={styles.buttonText}> Sign in with Google </Text>
                </Button>

                <Button primary rounded style={styles.roundedButton} onPress={() => this.onCreate()}>
                    <Text style={styles.buttonText}> Create Account </Text>
                </Button>
                <TouchableHighlight style={styles.footer} onPress={() => this.onLogin()}>
                    <Text style={Object.assign({},styles.conditionText,{padding: 2})}>Already have an Account ? <Text style={{color:'#5F7EFE'}}>Log In</Text></Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.lastfoot} onPress={()=> this.pushRoute('terms')} >
                    <Text style={styles.lastfoottext}> Terms & Conditions </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.lastfoot1} onPress={()=> this.pushRoute('privacy')} >
                    <Text style={styles.lastfoottext}> Privacy Policy </Text>
                </TouchableHighlight>
            </View>
        );
    }

    getHeader(){
        return(
            <View style={styles.header}>
                <Image source={logo} style={styles.logo}/>
                <Image source={Word_Mark} style={{alignSelf:'center',marginTop:60,marginBottom:10}}/>
                <Text style={styles.heading}>Welcome</Text>
            </View>
        )
    }

    render(){
        return(
            <Image source={splashScreen1} style={styles.splashScreen}/>
        )
    }
}

const mapStateToDispatch = ( state) => ({
})

function bindActions(dispatch){
    return {
        signInWithGmail: () => dispatch(signInWithGmail()),
        onLogin:() => this.onLogin(),
        onCreate:() => this.onCreate(),
        startAuthListener: (base) => dispatch(startAuthListener(base)),
        pushRoute: (route, key) => dispatch(pushRoute(route, key)),
        resetRoute:(key) => dispatch(resetRoute(key)),
        reset: (routes, key, index) => dispatch(reset(routes, key, index)),
    }
}

export default connect(mapStateToDispatch, bindActions)(FirstPage)
