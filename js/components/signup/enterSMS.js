import React, {Component} from 'react';

/* Open source modules */
import {View, Image , Text,Dimensions, ActivityIndicator, TouchableHighlight} from 'react-native'
import { Container , Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';


/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import SmsInput from '../inputs/smsinput'
import Spinner from '../inputs/Spinner'

import {verifyCode, syncToStore, showError, pushRoute, popRoute} from '../../actions/login';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const deviceWidth = Dimensions.get('window').width;

const back_arrow  = require('../../../images/Back-Arrow-Black.png');
import {Actions} from 'react-native-router-flux';


/* Component class */

class EnterSMS extends Component{

    constructor(props){
        super(props);
        this.state = {
            text:'',      // incase if we receive the text from outside
            status:'waiting',
            loading: false,
            fields: []
        }
    }
    componentWillMount(){
        Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow })
    }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(){
        this.props.popRoute();
    }

    static defaultProps={
        data: '+19724087652'
    }

  componentDidMount(){
      
  }

    renderContent1(){
        const phone = this.props.data;
        
        return(
        <View style={baseStyle.bg}>
            <Text style={Object.assign({},baseStyle.regulartext, {alignSelf:'center',marginTop:40,marginBottom:10})}> Four Digit Code </Text>
              <SmsInput
                text={this.state.text}
                status={this.state.status}
                onComplete={() => this.setState({loading: !this.state.loading})}
                onVerify={(code) => this.props.verifyCode(phone, code)}
                onSuccess={() => {
                    
                    this.props.syncToStore({verifyPhone: true}); 
                    this.setState({loading: !this.state.loading},()=>this.pushRoute('userprofile'))
                }}
                onFailure={(error) => {
                    
                    this.props.syncToStore({verifyPhone: false});
                    this.popRoute();
                    //this.props.syncToStore({verifyPhone: false}); 
                    //this.props.showError({message:error.message,title:'SIGNUP ERROR!', callback: this.popRoute.bind(this)})
                    //this.props.syncToStore({verifyPhone: false})
                    //this.setState({loading: !this.state.loading},
                    //                ()=>this.props.showError({message: error.message, title: 'SIGNUP ERROR!',callback: this.popRoute.bind(this)})
                     //           )
                }}
              />
              <TouchableHighlight onPress={this.popRoute.bind(this)}>
                <Text style={Object.assign({},baseStyle.regulartext, {alignSelf:'center', color:'#5F7EFE'})}> Didnt get the text? </Text>
              </TouchableHighlight>
        </View>
        );
    }
    
    render(){
        return(
        <Container theme={theme}>
              <Content style={{backgroundColor:'#FFF'}} keyboardShouldPersistTaps="always">
                    <View style={{backgroundColor:'#D1D2D1'}} >
                        <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*3/8)})}/>
                    </View>
                    <Spinner visible={this.state.loading} />
                    <View style={{flex:1,justifyContent:'flex-end', marginTop: 40}}>
                        {this.renderContent1()}
                    </View>
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
         showError: (msg, cb) => dispatch(showError(msg, cb)),
         verifyCode: (phone, code) => dispatch(verifyCode(phone, code)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
    }
}

export default connect(mapStateToDispatch, bindActions)(EnterSMS)