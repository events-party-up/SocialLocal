import React, {Component} from 'react';

/* Open source modules */
import {View, Image,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
const Permissions = require('react-native-permissions');

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {showError, syncToStore, pushRoute, popRoute} from '../../actions/login';

const glow2 = require('../../../images/glow2.png');
const location_circle = require('../../../images/Location.png');
const notification_circle = require('../../../images/Notification.png');
const logo  = require('../../../images/social-logo.png');
const deviceWidth = Dimensions.get('window').width;

const back_arrow  = require('../../../images/Back-Arrow-Black.png');
import {Actions} from 'react-native-router-flux';

/* Component class */

class PushService extends Component{

    constructor(props){
        super(props);
        this.state = {
            phone: '',
            country: '',
            fields: []
        }
    }

    componentWillMount(){
        Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow })
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
        <View style={baseStyle.bg}>
            <Image source={notification_circle} style={{alignSelf:'center', marginBottom:20,width:80,height:80}} />
           
            <Text style={_.assign({}, baseStyle.regulartext,{fontSize: 16, marginBottom: 8} )}>Let Socialvite notify you? </Text>
            <Text style={baseStyle.regulartext}> We'll only send alerts when there are some irresistable events which you don't want to miss out.</Text>
              <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 58,justifyContent:'center',backgroundColor: '#5F7EFE',width:300,height:50})} onPress={() => this.onPress()}>
                <Text style={baseStyle.buttonText}> Allow Notifications </Text>
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
                <Content style={{backgroundColor:'#FFF'}}>
                <View style={{backgroundColor:'#D1D2D1'}} >
                    <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*6/8)})}/>
                </View>
                <Image source={glow2} style={baseStyle.container}>
                    <View style={{flex:1,justifyContent:'flex-start',marginTop:100}}>
                        {this.renderContent1()}
                    </View>
                </Image>
                </Content>
        </Container>
        );
    }
}


class LocationService extends Component{

    constructor(props){
        super(props);
        this.state = {
            phone: '',
            country: '',
            fields: []
        }
    }

    componentWillMount(){
        Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow })
    }

    pushRoute(route){
        this.props.pushRoute({ key: route })
    }

    popRoute(route){
        this.props.popRoute();
    }

    onPress(){
      Permissions.request('location')
        .then(response => {
        //returns once the user has chosen to 'allow' or to 'not allow' access
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        
        this.setState({ photoPermission: response }, () => {
            Promise.resolve()
                    .then(() => this.props.syncToStore({locationService: response}))
                    .then(()=> this.pushRoute('pushService'))
        })
      });
      //this.pushRoute('pushService')
    }

    renderContent1(){
        return(
        <View style={baseStyle.bg}>
            <Image source={location_circle} style={{alignSelf:'center', marginBottom:20}} />
           <Text style={_.assign({}, baseStyle.regulartext,{fontSize: 16, marginBottom: 8} )}>Let Socialvite locate you? </Text>
            <Text style={_.assign({}, baseStyle.regulartext)} >To use Socialvite you must {"\n"}
                    enable location services when {"\n"} the app is in use
            </Text>
              
              <Button primary rounded
                 style={Object.assign({},baseStyle.normalButton,{marginTop: 58,width:300,height:50,justifyContent:'center',backgroundColor: '#5F7EFE'})}
                 onPress={() => this.onPress()}>
                <Text style={baseStyle.buttonText}> Allow Location Services </Text>
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
                <View style={{backgroundColor:'#D1D2D1'}} >
                    <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*5/8)})}/>
                </View>
                <Image source={glow2} style={baseStyle.container}>
                    
                    <View style={{flex:1,justifyContent:'flex-start',marginTop:100}}>
                        {this.renderContent1()}
                    </View>
                    
                </Image>
                </Content>
        </Container>
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

export default {
    LocationService: connect(mapStateToProps, bindAction)(LocationService),
    PushService: connect(mapStateToProps, bindAction)(PushService),
}
