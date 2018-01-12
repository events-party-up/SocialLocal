import React, {Component} from 'react';

/* Open source modules */
import {View, Image,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles'
import baseStyle from '../../themes/base-styles';

const glow2 = require('../../../images/glow2.png');
const image = require('../../../images/slide2.png');
const deviceWidth = Dimensions.get('window').width;

import {Actions} from 'react-native-router-flux';

/* Component class */

class Slide1 extends Component{

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
      Permissions.request('notification')
        .then(response => {
        //returns once the user has chosen to 'allow' or to 'not allow' access
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'

        this.setState({ photoPermission: response }, () => {
            Promise.resolve().then(()=> this.props.syncToStore({pushService: response}))
                            .then(() => this.pushRoute('invite'))
        })
      });
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
             <Text style={_.assign({}, baseStyle.regulartext,{fontSize: 20, fontWeight:'600'} )}>Connect</Text>
        </View>
        );
    }

    renderContent3(){
        return(
        <View style={styles.bg}>
            <Text style={_.assign({}, baseStyle.regulartext,{lineHeight: 20} )}>Follow users on the app, and when they follow you back, invite them to hangout.</Text>
            <Text style={_.assign({}, baseStyle.regulartext,{lineHeight: 20, marginTop:20} )}>If a user doesn’t follow you, you won’t be able to invite them to your event.</Text>
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

export default Slide1