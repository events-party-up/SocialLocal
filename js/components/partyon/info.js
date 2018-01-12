    import React, {Component} from 'react';

/* Open source modules */
import {View, Image,InteractionManager } from 'react-native'
import { Container, Text,  Content, Button, Header, Icon , Title, Thumbnail} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions,ActionConst} from 'react-native-router-flux';
import ImageResizer from 'react-native-image-resizer';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Map from '../inputs/Map';
import { syncToStore, showError, pushRoute, popRoute, resetRoute } from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import styles from './styles';
import CountDownTimer from '../inputs/countDownTimer';

import * as hm from '../inputs/helpers'

import LocationPickerMap from '../inputs/pickLocationFromMap';


import ImageSlider from 'react-native-image-slider';


const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/Artboard.png');
const party = require('../../../images/party.jpg');
const blankphoto = require('../../../images/photo.png');

/* Component class */

class Info extends Component{

    constructor(props){
        super(props);
       let {regUsers} = this.props;
        var invitedList = [];
        _.forEach(_.keys(regUsers),function(m){
        if(regUsers[m])
          invitedList.push(m) })//Object.keys(this.props.regUsers).length
        var invitedCount = invitedList.length;
        this.state = {
            phone: '',
            country: '',
            fields: [],
            invitedCount: invitedCount,
            loading: false,
            isReady:false,
            userLocation:this.props.data.info.location
        }
    }

    static defaultProps = {
        invited: []
    }

    jumpTo(route){
        this.props.resetRoute(route);
    }
    
    pushRoute(route){
        this.props.pushRoute({ key: route })
    }

    popRoute(route){
        this.props.popRoute();
    }

    onSubmit(){
        const {data, regUsers} = this.props;
        let {info, inviteUsers} = data
        
        this.setState({loading: true})
        return this.uploadPhoto(info)
        .then((url) => {
            if(url.length !== 0){
              info['images']=url ;
            }
            //...info,
            //images: url
        })
        .then((event)=> db.saveEventData(info, regUsers,this.props.user, inviteUsers))
        .then((event_id)=> { 
          let ownedEvents = Object.assign({}, this.props.user.ownedEvents);
          ownedEvents[event_id] = "true";
          this.props.syncToStore({ownedEvents});
          this.setState({loading: false});
        }).catch((e)=> {console.log(e) ; this.setState({loading: false}) })
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
          hm.getUserRegion().then((region)=> this.setState({ userLocation: region, isReady: true , marker: this.props.data}) )
                
        })
        Actions.refresh({rightTitle: 'Done', onRight: this.handleSubmit.bind(this)})
    }

    uploadPhoto(event){
        if(event.images){
            let imagePromise=[];
            let images=event.images
                images.forEach(function(image){
                    let pr = ImageResizer.createResizedImage(image.uri, 640,480,'JPEG',100)
                    .then((resizedImageUri) => db.uploadPhoto2({uri: resizedImageUri}))
                 imagePromise.push(pr)
                    
                })
                return(Promise.all(imagePromise));
        }

        else
            return new Promise.resolve("")
    }


  getUserImage(user){
    const {photo} = user;
    if(photo){
      return {uri: photo};
    }
    else{
      return blankphoto;
    }
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
            .then(() => this.onSubmit())
            .then(() => {Actions.callback({ key: 'homescreen', type: 'reset'}); Actions.Maps({type: ActionConst.RESET})} )//this.jumpTo('home_main'))
            .catch((error) => this.props.showError({message: error.message, title: 'Party Error'}))
    }//
    
    register(field){
        let s = this.state.fields;
        s.push(field);
        this.setState({fields: s})
    }

    getImage(event){
        
        if(event.info.images && event.info.images.length > 0)
            return(
                      <ImageSlider  style={{backgroundColor:'white', height: 200 }} height={200}  images={event.info.images} />
            )
            else
                return   <ImageSlider  style={{backgroundColor:'white', height: 200 }} height={200}  images={[logo]} />
        
    }

    renderContent1(){
        const event = this.props.data.info;
        if(event){
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{flex:1, justifyContent: 'center', flexDirection:'row', width: null, height: 220, backgroundColor: 'white'}} >
                     {this.getImage(this.props.data)}
                </View>

            <View style={{padding: 16}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Thumbnail size={40} source={this.getUserImage(this.props.user)} />
                <View style={{flex: 1,flexDirection:'column',alignSelf:'stretch',justifyContent:'flex-start', marginLeft: 10}}>
                  <Text style={_.assign({},baseStyle.regularText,{textAlign:'left', fontSize: 15, marginTop: 3})}>{event.name}</Text>
                  <Text style={_.assign({},baseStyle.regulartext, {fontSize: 11, textAlign:'left', marginTop: 3})}>{event.message}</Text>
                </View>              
              </View>
            </View>

            <View>
              <View style={{ flex: 1,marginTop: 18,flexDirection:'row',padding:16,borderTopWidth:0.5,borderColor:'#d3d3d3'}}>
                <Text style={_.assign({},baseStyle.conditionText,{fontSize: 12,flex:1, justifyContent:'flex-start'})}>{this.state.invitedCount} People Invited</Text>
                <CountDownTimer style={{color:'#5F7EFE', marginRight: 6}} event={this.props.data} />                   
              </View>
            </View>

            <View style={baseStyle.divider}>
              <Text style={baseStyle.dividerText}>LOCATION </Text>
            </View>

            <View style={{margin:16}}>
              <View style={{flexDirection:'row', marginBottom:10}} >
                <Text style={_.assign({},{fontFamily:'worksans-regular',paddingRight:15, fontSize: 12,flex:1, justifyContent:'flex-start'})}>{this.props.data.info.location.address}</Text> 
                <Text style={_.assign({},baseStyle.conditionText,{fontSize: 12,justifyContent:'flex-end',textAlign:'right'})}> {hm.longLatDistance(this.state.userLocation.latitude,this.state.userLocation.longitude,this.props.data.info.location.latitude,this.props.data.info.location.longitude) } Away</Text>               
              </View>
              <LocationPickerMap 
                style={{height:145}}
                regionData={{latitude: this.props.data.info.location.latitude ,longitude: this.props.data.info.location.longitude }}
                regionChanged={()=> {} }
              />
            </View>
          </View>
        )
      }
        else
            return;
    }

    renderContent2(){
        return(
        <View>
          <View style={baseStyle.divider}>
                <Text style={Object.assign({},baseStyle.regularText,{fontSize: 11, marginLeft: 10})}>SHARE </Text>
            </View>
            <FormInput style={baseStyle.input}
              onChangeText={facebook => this.setState({ facebook })}
              ctype='share'
              onComponentMounted={(val) => this.register(val)}
              title='Facebook'
              icon='logo-facebook'
            />
            <FormInput style={baseStyle.input}
              onChangeText={twitter => this.setState({ twitter })}
              ctype='share'
              onComponentMounted={(val) => this.register(val)}
              title='Twitter'
              icon='logo-twitter'
            />
        </View>
        );
    }
    

    render(){
        return(
          <Container theme={theme}>    
            <Content style={{flex:1,backgroundColor:'#FFF'}}>
              <View style={baseStyle.line}/>
              <Image source={glow2} style={baseStyle.container}>
                <Spinner visible={this.state.loading}/>
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
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         resetRoute: (route) => dispatch(resetRoute(route)),
         showError:(msg, cb) => dispatch(showError(msg, cb))
    }
}

export default connect(mapStateToDispatch, bindActions)(Info)
