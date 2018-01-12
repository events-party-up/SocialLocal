import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {showError, syncToStore, pushRoute, popRoute} from '../../actions/login';
import { _signOut} from '../../actions/login';


const glow2 = require('../../../images/glow2.png');
const circle = require('../../../images/AddPhoto.png');
const logo  = require('../../../images/social-logo.png');

class NoOp extends Component{

    constructor(props){
        super(props);
        this.state = {
            phone: '',
            country: '',
            fields: []
        }
    }

    pushRoute(route){
        this.props.pushRoute({ key: route })
    }

    popRoute(route){
        this.props.popRoute();
    }

    onLogout(){
        this.props._signOut();
    }

    renderContent1(){
        return(
        <View style={baseStyle.bg}>
            <Image source={circle} style={{alignSelf:'center', marginBottom:20}} />
           
            <Text style={baseStyle.regulartext}> You must enable location service in order to use.</Text>

            <Button warning rounded
                 style={Object.assign({},baseStyle.normalButton,{backgroundColor:'red', marginTop: 58,justifyContent:'center'})}
                 onPress={() => this.onLogout()}>
                <Text style={baseStyle.buttonText}> Logout </Text>
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
                    
                    <View style={{flex:1,justifyContent:'flex-start'}}>
                        {this.renderContent1()}
                    </View>
                    
                </Image>
                </Content>
        </Container>
        );
    }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    syncToStore: (userData) => dispatch(syncToStore(userData)),
    _signOut: () => dispatch(_signOut())
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindActions)(NoOp);