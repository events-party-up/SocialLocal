import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity, InteractionManager,Dimensions,KeyboardAvoidingView, TextInput,} from 'react-native'
import { Container, Text, Content, Button, Thumbnail, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import {Actions,ActionConst} from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob'

//recently added
import RNGooglePlaces from 'react-native-google-places';
import MapView from 'react-native-maps';


/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Map from '../inputs/Map';
import * as db from '../../helpers/db';
import {DURATION} from '../../helpers/constants';
import { showError, pushRoute, popRoute,resetRoute } from '../../actions/login';
import {updateEvent} from '../../actions/events';
import styles from './styles';

import LocationPickerMap from '../inputs/pickLocationFromMap';
import * as hm from '../inputs/helpers'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const ASPECT_RATIO = deviceWidth / deviceHeight;
var LATITUDE_DELTA = 0.005922
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const blankphoto = require('../../../images/party1.jpg');
var flag = true;
const nextScreen = require('../../../images/Next-Screen.png');
/* Component class */

class PartyOn extends Component{

  constructor(props){
      super(props);
      this.state = {
          eventname: null,
          photo : null,
          message : null,
          photoUploaded: false,
          eventPhoto: [],
          isReady:false,
          fields: [],
          duration: 1,
          imageCount:0,
          address:'',
          mapReady: false,          
      }
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions(() => {
          this.setState({isReady: true})
      })
      Actions.refresh({ renderLeftButton: (()=> this.leftButton() ), rightTitle:"Next", leftTitle:"Cancel", onRight: this.handleSubmit.bind(this)})
  }

  leftButton(){
    return(<TouchableOpacity onPress={()=> { Actions.callback({ key: 'homescreen', type: 'reset'}); Actions.Maps({type: ActionConst.RESET})} } ><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>);
  }

  jumpTo(route){
      this.props.resetRoute(route);
  }

  pushRoute(route){
      
      this.props.pushRoute({ key: route, data: this.getEvent()})
  }

  popRoute(route){
      this.props.popRoute();
  }

  componentWillMount(){
    this.setNavigation();
  }

  setNavigation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
          this.setState({ mapReady: true,
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )

  }


  onPhotoPress(){
    
    var options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const source1 = {uri: response.uri.replace('file://', ''), isStatic: true};
            
        // or a reference to the platform specific asset location
         imageArray = this.state.eventPhoto;
         imageArray.push(source1: true);
         let imageArrayLength = (imageArray.length) ? imageArray.length : 0
            this.setState({
                eventPhoto: imageArray,
                photoUploaded: true,
                imageCount: imageArrayLength
            });
            }
        })
  }


  addHours(hour){
      date = new Date()
      date.setHours(date.getHours()+ hour)
      return date.getTime();
  }


  getEvent(){
      const {eventname, eventPhoto, message, photoUploaded} = this.state;
      const {region} = this.state;
      const {uid, name} = this.props.user;
      return { 
        info: {
          name: eventname,
          message,
          images: eventPhoto,
          created_at:{timestamp:Date.now()},     
          owner: {uid, name},
          finished_at:{timestamp:this.addHours(this.state.duration)},
          location:{
              latitude: region.latitude,
              longitude: region.longitude,
              address:this.state.address

          }
        }
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
          atleastOneTrue = atleastOneTrue || field.state.input !== '' || field.state.input !== undefined 
        })
        
        Promise.all(allPromises)
            .then(() => {if(!atleastOneTrue) throw new Error('Blank Input')})
            .then(() => this.pushRoute('partyInvite'))
            .catch((error) => this.props.showError({message:"Please put a title for your PartyOn", title:'PARTYON ERROR!'}))
  }


  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

  fetchData(regionData) {
    //FetchData should not run when the location is manually typed
    if(!flag){
      flag = true;
      return;
    }

    var s = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + regionData.latitude + ','+ regionData.longitude +'&key=AIzaSyC4VDnNhM4TjPU2RlsaGILsir0eyF-GBVg';
    RNFetchBlob.fetch('GET', s)
    .then((response) => response.json())
    .then((responseData) => {
      var address = responseData.results[0] ? responseData.results[0].formatted_address : '';
      this.setState({ address: address,region: regionData });
    })
    .done();
  }

  getPlaces(){
    flag = false;
    RNGooglePlaces.openAutocompleteModal({
      latitude: (this.state.region) ? this.state.region.latitude : 0,
      longitude: (this.state.region) ? this.state.region.longitude : 0,
    }).then((place) => {
      this.setState({  address:place.name, region:{latitude: place.latitude,longitude: place.longitude,latitudeDelta: LATITUDE_DELTA,longitudeDelta: LONGITUDE_DELTA}})
    }).catch(error => console.log(error.message));  
  }
  onRegionChange(region_data){
    //this.fetchData(region_data.latitude,region_data.longitude);
    this.setState({region: region_data})
  }

  getImageHolder(){
    var image_view=[];

    for(let i=0; i<this.state.imageCount; i++){
      image_view.push(
          <Image 
            source={ ( this.state.eventPhoto[i] && this.state.photoUploaded) ? this.state.eventPhoto[i]: blankphoto} 
            style={{backgroundColor:'transparent',
              justifyContent: 'flex-start',
              margin: 5,
              alignItems: 'flex-start',height:200}} >
              <Icon onPress={()=> this.removeImage(i) } name='md-close-circle' style={{fontSize:35,padding:5,color:'#d3d3d3'}} /> 
          </Image>
        );
    }
    return image_view;
  }

  removeImage(position){
    images=this.state.eventPhoto;
    images.splice(position,1);
    this.setState({eventPhoto: images,imageCount: this.state.imageCount-1 })
  }

  renderMap(){

    if (this.state.mapReady){
      return (<View>
          <LocationPickerMap 
            style={{height:145}}
            initialRegion={this.state.region}
            regionData={ {latitude: this.state.region.latitude ,longitude: this.state.region.longitude }}
            regionChanged={(region)=>{this.fetchData(region)}}
            pickLocationPin={true}
          />
          </View>)
        }
        else
          return
  }

  renderContent1(){
    return(
      <View style={{flex: 1}}>
        <View style={{padding: 20,height:76}}>
         <Text style={_.assign({},baseStyle.regulartext,{paddingLeft:16,paddingRight:16})}>Dude, where’s the party?! Enter the details of your plans below. </Text>
        </View>
        <View style={_.assign({},baseStyle.line,{backgroundColor:'#d3d3d3'})}/>
        <View >
          <FormInput 
            onChangeText={eventname => this.setState({ eventname })}
            ctype='eventname'
            style={{paddingLeft: 16, paddingRight:16}}
            title='Party On Name'
            autoFocus={true}
            onComponentMounted={(val) => this.register(val)}
            autoCapitalize = {'sentences'}
            autoCorrect = {true}
            multiline= {true}
          />
        </View>
        <View style={{flex:1}}>
          {this.renderMap()}
        </View>
        
        <TouchableOpacity style={styles.itemView} onPress={()=> this.getPlaces() }>
          <Text style={{fontSize:14,color:'#333333'}} > Location </Text>
          <Text style={{flex:1,fontSize:14,color:'#333333',textAlign:'right',padding:5, marginRight:10}} numberOfLines={1}  ellipsizeMode={'tail'}  > {this.state.address} </Text>
          <Image source={nextScreen} />
        </TouchableOpacity>
        <View style={baseStyle.line}/>
        <FormInput 
          onChangeText={duration => this.setState({ duration })}
          ctype='duration'
          duration={DURATION}
          onComponentMounted={(val) => this.register(val)}
          placeholder='Duration'
          title='Duration'
        />

        <View style={baseStyle.divider}>
          <Text style={baseStyle.dividerText}>OPTIONAL </Text>
        </View>
        <KeyboardAvoidingView style={{padding: 16,justifyContent: 'flex-start',borderBottomWidth: 1,borderStyle:'solid',borderColor:'#D7D7D7'}} behaviour={'padding'}>
          <TextInput
            style={{height: 40, color: '#333333', fontSize: 14, fontFamily: 'worksans-regular'}}
            onChangeText={message => this.setState({ message })}
            placeholder='Description'
            autoCapitalize = {'sentences'}
            autoCorrect = {true}
            multiline= {true}
          />
          
        </KeyboardAvoidingView>
        
        <TouchableOpacity style={styles.itemView} onPress={ ()=> this.onPhotoPress()} >
          <Text style={{flex:1,textAlignVertical:'center',fontSize:14,color:'#333333'}} >Photos </Text>
          <Text style={{textAlign:'right',fontSize:14,color:'grey',marginRight:16}} >Add Photo </Text>
          <Image source={nextScreen} />
        </TouchableOpacity>

        
        <View style={{flexDirection:'column'}} >
         {this.getImageHolder()}
        </View>  
      </View>
    );
  }

  render(){
    return(
      <Container theme={theme}>
        <Content style={{backgroundColor:'#FFF'}}>
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
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         resetRoute: (route) => dispatch(resetRoute(route)),
         showError: (msg, cb) => dispatch(showError(msg, cb)),
         reset: (routes, key, index) => dispatch(reset(routes, key, index)),
         updateEvent:(msg)=> dispatch(updateEvent(msg))
    }
}

export default connect(mapStateToDispatch, bindActions)(PartyOn)