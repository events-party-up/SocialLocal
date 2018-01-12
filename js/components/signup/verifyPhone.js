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
import SProgressBar from '../inputs/SProgressBar';
//import CountryPickComponent from 'react-native-country-picker-modal';
import CountryPicker from '../inputs/CountryPicker';
import {getSMS, syncToStore, signOutUser, showError, pushRoute, popRoute} from '../../actions/login';
import { closeError } from '../../actions/error';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const backArrow  = require('../../../images/black_back_arrow.png');
const deviceWidth = Dimensions.get('window').width;

const back_arrow  = require('../../../images/Back-Arrow-Black.png');


/* Component class */

class VerifyPhone extends Component{

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
        
        const {phone} = this.state;
        this.props.syncToStore({phone})
        this.props.pushRoute({ key: route, data: phone })
    }

    popRoute(route){
        this.props.popRoute();
    }

    requestVerificationCode(){
        
        const {phone} = this.state;
        this.props.getSMS(phone)
        return this.pushRoute('entersms')
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
            .then(() => this.requestVerificationCode())
            .catch(err => this.props.showError({message:err.message, title:'VERIFY PHONENUMBER'}))

    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

    renderContent1(){
        return(
        <View style={baseStyle.bg}>
            <Text style={Object.assign({},baseStyle.regulartext, {alignSelf:'center',marginTop:14})}> Please provide a phone number
 for us to verify you’re a real person </Text>
             <CountryPicker style={{flex:1,marginTop:30}}
                  onChangeText={phone => this.setState({phone})}
                  ctype='phone'
                  onComponentMounted={(val) => this.register(val)}
              />
             
              <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 58, justifyContent: 'center',backgroundColor: '#5F7EFE',width:300})} onPress={() => this.handleSubmit()}>
                <Text style={baseStyle.buttonText}> Continue </Text>
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
                    <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*2/8)})}/>
                </View>
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
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         getSMS: (phone) => dispatch(getSMS(phone)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg))
    }
}

export default connect(mapStateToDispatch, bindActions)(VerifyPhone)