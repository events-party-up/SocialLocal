import React, {Component} from 'react';

/* Open source modules */
import {View, Image,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles'
import baseStyle from '../../themes/base-styles';
import {showError, syncToStore, pushRoute, popRoute} from '../../actions/login';

const glow2 = require('../../../images/glow2.png');
const image = require('../../../images/slide5.png');
const deviceWidth = Dimensions.get('window').width;

import {Actions} from 'react-native-router-flux';

/* Component class */

class Slide5 extends Component{

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

    onPress(){
        console.log("on press")
        Promise.resolve().then(()=> this.props.syncToStore({firstLogin: false}))
                .then(() => Actions.home({type:'reset'}))
    }

    renderContent1(){
        return(
        <View style={{alignSelf:'center', justifyContent:'flex-start', padding:20}} >
            <Image source={image}/>
        </View>
        );
    }

    renderContent2(){
        return(
        <View style={styles.bg1}>
             <Text style={_.assign({}, baseStyle.regulartext,{fontSize: 20, fontWeight:'600'} )}>Discover</Text>
        </View>
        );
    }

    renderContent3(){
        return(
        <View style={styles.bg}>
            <Text style={_.assign({}, baseStyle.regulartext,{lineHeight: 20} )}>Socialviters get access to pop-up events like open bars and block parties. </Text>
            <Text style={_.assign({}, baseStyle.regulartext,{lineHeight: 20, marginTop:20} )}>Invite your friends and follow our Socialvite profile for access.</Text>

             <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 58,justifyContent:'center',backgroundColor: '#5F7EFE',width:300,height:50, marginBottom:50})} onPress={() => this.onPress()}>
                <Text style={baseStyle.buttonText}>Get started</Text>
            </Button>
        </View>
        );
    }
    

    render(){
        return(
         
                <View source={glow2} style={baseStyle.container}>
                    <View style={{flex:2,justifyContent:'flex-end', marginTop:100}}>
                        {this.renderContent1()}
                    </View>
                    <View style={{flex:1,justifyContent:'flex-start'}}>
                        {this.renderContent2()}
                    </View>
                    <View style={{flex:3,backgroundColor:'red', justifyContent:'flex-start'}}>
                        {this.renderContent3()}
                    </View>
                </View>
               
        );
    }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    syncToStore: (userData) => dispatch(syncToStore(userData))
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindAction)(Slide5)