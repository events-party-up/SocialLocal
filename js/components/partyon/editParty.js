import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity, InteractionManager,KeyboardAvoidingView, TextInput,Modal,TouchableHighlight } from 'react-native'
import { Container, Text, Content, Button, Thumbnail, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import {Actions} from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob'
import ImageResizer from 'react-native-image-resizer';

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
import { showError, pushRoute, popRoute } from '../../actions/login';
import {updateEvent,endParty} from '../../actions/events';
import styles from './styles';
import Spinner from '../inputs/Spinner';

import LocationPickerMap from '../inputs/pickLocationFromMap';
import CountDownTimer from '../inputs/countDownTimer';
import {WithEventSubscription} from '../misc/WithEventSubscription'


const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const blankphoto = require('../../../images/party1.jpg');
const nextScreen = require('../../../images/Next-Screen.png');
var flag = false;
/* Component class */

class EditParty extends Component{

  constructor(props){
      super(props);
      
      this.state = {
          eventname: this.props.event.info.name,
          photo : null,
          message : this.props.event.info.message,
          photoUploaded: false,
          eventPhoto: this.props.event.info.images,
          eventPhotoCount:(this.props.event.info.images)? this.props.event.info.images.length : 0,
          uploadEventPhoto:[],
          uploadEventPhotoCount:0,
          isReady:false,
          fields: [],
          eventDetails: this.props.event,
          duration: 1,
          modalVisible:false,
          address:this.props.event.info.location.address,
          region:{
            latitude: this.props.event.info.location.latitude,
            longitude: this.props.event.info.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,},
      }
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions(() => {
          this.setState({isReady: true})
      })
      Actions.refresh({onRight: this.handleSubmit.bind(this)})
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
        // console.log('User cancelled image picker');
      }
      else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            const source1 = {uri: response.uri.replace('file://', ''), isStatic: true};
            
        // or a reference to the platform specific asset location
         imageArray = this.state.uploadEventPhoto;
         imageArray.push(source1: true);
         let imageArrayLength = (imageArray.length) ? imageArray.length : 0
            this.setState({
                uploadEventPhoto: imageArray,
                photoUploaded: true,
                uploadEventPhotoCount: imageArrayLength
            });
            }
        })
  }

  addHours(hour){
      date = new Date()
      date.setHours(date.getHours()+ hour)
      return date.getTime();
  }

  addTimeAfterPicker(hour){
    let finishingTime1 = _.get(this.props,'event.info.finished_at.timestamp')
    
    let finished_at = new Date(finishingTime1)
    finished_at.setHours(finished_at.getHours()+hour)

    this.setState({ 
      modalVisible:false,
      eventDetails: _.merge({},this.props.event, {info: {finished_at: {timestamp: finished_at/1}}})
   });
    return;
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
          fields: [],
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
            atleastOneTrue = atleastOneTrue || field.state.input !== '' 
        })
        
        Promise.all(allPromises)
            .then(() => {if(!atleastOneTrue) throw new Error('Blank Input')})
            .then(() => this.onSubmit())
            .catch((error) => { this.setState({loading: false}); this.props.showError( {message:"Blank Input!"+error, title:'PARTYON ERROR!'}) })
  }

  uploadPhoto(images){
      if(images){
          let imagePromise=[];
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

  onSubmit(){
    
    const {region} = this.state
    images = (this.state.eventPhoto) ? this.state.eventPhoto : []
    this.setState({loading: true})
    //return this.uploadPhoto(info)
    
    let info = {}
    // update name
    info['name'] = this.state.eventname;

    // update message
    if (this.state.message !== ('' || undefined))
      info['message'] = this.state.message;

    // update info location
    info.location={
      longitude: region.longitude, 
      latitude: region.latitude,  
      address: this.state.address
    }
    

    // update images
    return this.uploadPhoto(this.state.uploadEventPhoto)
      .then((url)=> info.images = images.concat(url))
      .then(() => _.merge({}, this.state.eventDetails, {info}))
      .then((event) => db.editEventData(event, this.props.user))
      .then(() => this.popRoute())
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
  }

  fetchData(latitude, longitude) {
    //fetchData should not run when location is manually typed.
    var s = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ','+ longitude +'&key=AIzaSyC4VDnNhM4TjPU2RlsaGILsir0eyF-GBVg';
    RNFetchBlob.fetch('GET', s)
    .then((response) => response.json())
    .then((responseData) => {
      var address = responseData.results[0]? responseData.results[0].formatted_address : '';
      this.setState({ address: address });
    })
    .done();
  
  }

  getPlaces(){
    flag = false;
    RNGooglePlaces.openAutocompleteModal({
      latitude: (this.state.region) ? this.state.region.latitude : 0,
      longitude: (this.state.region) ? this.state.region.longitude : 0,
    }).then((place) => {
      this.setState({ address:place.name, region:{latitude: place.latitude,longitude: place.longitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421}})
    }).catch(error => console.log(error.message));  
  }

  onRegionChange(region_data){
    if(flag){
      
      this.fetchData(region_data.latitude,region_data.longitude);
      this.setState({region: region_data})
    }
    flag = true
  }

  onEditInviteButton(){
    this.props.pushRoute({  key: 'partyInvite', 
                            data: this.props.event, 
                            editInvite: true
                        })
  }

  getImageHolder(){
    var image_view=[];
    for(let i=0; i<this.state.eventPhotoCount; i++){
      image_view.push(
          <Image 
            source={ ( this.state.eventPhoto[i]) ? {uri: this.state.eventPhoto[i]} : blankphoto} 
            style={{backgroundColor:'transparent',
            justifyContent: 'flex-start',
            margin: 5,
            alignItems: 'flex-start',height:145}} >
              <Icon onPress={()=> this.removeImage(i) } name='md-close-circle' style={{fontSize:35,padding:5,color:'red'}} />
          </Image>
        );
    }

    for(let i=0; i<this.state.uploadEventPhotoCount; i++){
      image_view.push(
          <Image 
            source={ ( this.state.uploadEventPhoto[i] && this.state.photoUploaded) ? this.state.uploadEventPhoto[i]: blankphoto} 
            style={{backgroundColor:'transparent',
              justifyContent: 'flex-start',
              margin: 5,
              alignItems: 'flex-start',height:200}} >
              <Icon onPress={()=> this.removeUploadingImage(i) } name='md-close-circle' style={{fontSize:35,padding:5,color:'#d3d3d3'}} /> 
          </Image>
        );
    }

    return image_view;
  }

  removeImage(position){
    images=this.state.eventPhoto;
    images.splice(position,1);
    this.setState({eventPhoto: images,eventPhotoCount: this.state.eventPhotoCount-1 })
  }
  removeUploadingImage(position){
    images=this.state.uploadEventPhoto;
    images.splice(position,1);
    this.setState({uploadEventPhoto: images,uploadEventPhotoCount: this.state.uploadEventPhotoCount-1 })
  }

  renderContent1(){
      return(
      <View style={{flex: 1}}>
        <Modal
          animationType = {"slide"}
          transparent = {false}
          visible = {this.state.modalVisible}
        >
          <View>
            <View style={{marginTop:30,flexDirection:'row'}} >
              <Text style={{flex:1}}></Text>
              <Text style={{flex:1,textAlign:'center',padding:5}} >Add Time</Text>
              <Text onPress={()=> this.setState({modalVisible: false}) } style={{flex:1,textAlign:'right',padding:5}}>Cancel</Text>
            </View>
            {_.map(DURATION,(loc)=>
            <TouchableOpacity key={loc.key} style={styles.itemView} onPress={()=> this.addTimeAfterPicker(loc.key) } >
              <Text> {loc.time} </Text>
            </TouchableOpacity >
            )}
          </View>
         </Modal>
        <View>
          <FormInput 
            onChangeText={eventname => this.setState({ eventname })}
            ctype='eventname'
            style={{paddingLeft: 16, paddingRight: 16}}
            value={this.state.eventname}
            onComponentMounted={(val) => this.register(val)}
            placeholder='Party On Name'
            title={'Party On Name'}
            multiline= {true}
            autoCapitalize = {'sentences'}
            autoCorrect = {true}
          />
        </View>
          <View style={{flex:1}}>
            <LocationPickerMap 
              style={{height:160}}
              regionInitial={this.state.region}
              regionData={ {latitude: this.state.region.latitude ,longitude: this.state.region.longitude }}
              regionChanged={(region)=>this.onRegionChange(region)}
              pickLocationPin={true}
            />
          </View> 

          <TouchableOpacity style={styles.itemView} onPress={()=> this.getPlaces() }>
            <Text >Location </Text>
            <Text style={{flex:1,fontSize:14,textAlign:'right',marginRight:16,}} numberOfLines={1}  ellipsizeMode={'tail'}  > {this.state.address} </Text>
            <Image source={nextScreen} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemView} onPress={()=> this.onEditInviteButton() }>
            <Text >Edit Attendees </Text>
            <Text style={{flex:1,fontSize:14,textAlign:'right',marginRight:16,}} numberOfLines={1}  ellipsizeMode={'tail'}  ></Text>
            <Image source={nextScreen} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemView} onPress={()=> this.setState({modalVisible:true})} >
            <Text>Add Time </Text>
            <CountDownTimer style={{flex:1,fontSize:14,fontFamily: 'System', marginRight:16,textAlignVertical:'center',textAlign:'right'}} event={this.state.eventDetails} />
            <Image source={nextScreen} />
          </TouchableOpacity>

          <View style={baseStyle.divider}>
            <Text style={baseStyle.dividerText}>OPTIONAL </Text>
          </View>
          <KeyboardAvoidingView style={{padding: 16,justifyContent: 'flex-start',borderBottomWidth: 1,borderStyle:'solid',borderColor:'#D7D7D7'}} behaviour={'padding'}>
            <TextInput
              style={{height: 40, color: '#333333', fontSize: 14, fontFamily: 'worksans-regular', paddingTop: 0}}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              placeholder='Description'
              autoCapitalize = {'sentences'}
              autoCorrect = {true}
              multiline= {true}
            />
          </KeyboardAvoidingView>
          
          <TouchableOpacity style={styles.itemView} onPress={ ()=> this.onPhotoPress()} >
            <Text style={{flex:1,textAlignVertical:'center'}} >Photo </Text>
            <Text style={{textAlign:'right',fontSize:14,color:'grey',marginRight:16}} >Add Photo </Text>
            <Image source={nextScreen} />
          </TouchableOpacity>

          <View style={{flexDirection:'column'}} >
           {this.getImageHolder()}
          </View>
          
          <Button rounded
                 onPress={()=>{this.props.endParty(this.props.eventId)}}
                 style={_.assign({},styles.solidButton,{backgroundColor:'#5F7EFE',alignSelf:'stretch',margin:16,height:38, justifyContent: 'center'})} >
                 <Text style={{color: 'white'}}> End Party </Text>
          </Button>
      </View>
      
      );
  }

  render(){
      return(
      <Container theme={theme}>
        <Content style={{backgroundColor:'#FFF'}}>
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
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         showError: (msg, cb) => dispatch(showError(msg, cb)),
         reset: (routes, key, index) => dispatch(reset(routes, key, index)),
         endParty:(event_id)=> dispatch(endParty(event_id)),
         updateEvent:(msg)=> dispatch(updateEvent(msg))
    }
}

var mEditParty =  connect(mapStateToDispatch, bindActions)(EditParty)
//export default mEditParty
export default WithEventSubscription(mEditParty)
