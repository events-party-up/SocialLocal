import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title, Thumbnail} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';


/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Map from '../inputs/Map';
import { showError } from '../../actions/error';
import * as db from '../../helpers/db';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const party = require('../../../images/party.jpg');

/* Configuration */
const {
    pushRoute,
    popRoute,
    reset
} = actions;

/* Component class */

class Details extends Component{

    constructor(props){
        super(props);
        this.state = {
          fields: []
        }
    }

    static defaultProps = {
        
    }

    jumpTo(route){
        const routes = [ {key: route} ]
        this.props.reset(routes, this.props.navigation.key, 0);
    }
    
    pushRoute(route){
        this.props.pushRoute({ key: route, type: 'normal'}, this.props.navigation.key)
    }

    popRoute(route){
        this.props.popRoute(this.props.navigation.key);
    }

    
  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

    renderContent1(){
        return(
        <View style={{flex: 1}}>
            <FormInput style={baseStyle.input}
              onChangeText={mute => this.setState({ mute })}
              ctype='share'
              onComponentMounted={(val) => this.register(val)}
              title='Mute Notifications'
              icon='ios-alarm-outline'
            />
        </View>
        
        )
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
                <Title><Text style={baseStyle.regularText}>PARTY ON DETAILS</Text></Title>
              </Header>
              
                <Content style={{backgroundColor:'#FFF'}}>
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
    navigation: state.cardNavigation,
    uid: state.login.uid
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         reset: (routes, key, index) => dispatch(reset(routes, key, index)),
         showError:(msg, cb) => dispatch(showError(msg, cb))
    }
}

export default connect(mapStateToDispatch, bindActions)(Details)