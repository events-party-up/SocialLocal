import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';


/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, popRoute} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/AddPhoto.png');
const logo  = require('../../../images/social-logo.png');
const deviceWidth = Dimensions.get('window').width;

const back_arrow  = require('../../../images/Back-Arrow-Black.png');
import {Actions} from 'react-native-router-flux';


/* Component class */

class Profile extends Component{

    constructor(props){
        super(props);
        this.state = {
            name: '',
            username: '',
            location: 'Dallas',
            about: '',
            avatarSource: null,
            fields: [],
            photoUploaded: false,
            loading:false,
            isImageStyleBlank: true
        }
    }

    componentWillMount(){
        Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow })
        // check if photoURL is present in database
        this.setState({photoUploaded: false})
        const photo = _.get(this.props, 'user.photo');
        if(photo){
          this.setState({avatarSource: {uri: photo}, isImageStyleBlank: false});
        }
        else
          this.setState({avatarSource: blankphoto})
    }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(route){
        this.props.popRoute();
    }

    saveUserData(user){
        
        const {name, username, about, location, avatarSource, photoUploaded} = this.state;
        
        this.setState({loading: true})
        if(photoUploaded){
            return ImageResizer.createResizedImage(avatarSource.uri, 640,480,'JPEG',100)
                .then((resizedImageUri)=> db.uploadPhoto2({uri: resizedImageUri}))
                .then((photo) => this.props.syncToStore({name, username, city: location, about, photo}))
                .then(()=>{this.setState({loading:false}, ()=> this.pushRoute('locationService'))})
                .catch((e)=> {this.setState({loading:false});})
        }
        else{
          this.props.syncToStore({name, username, city: location, about })
          this.setState({loading:false}, ()=> this.pushRoute('locationService'))
        }
        // also upload photo to firebase storage
        // make sure that this.props.login.user is updated.
        //  this.uploadPhoto(this.state.avatarSource)
            //.then((url) => this.props.syncToStore({name, username, photo: url}))
            //.then(() => this.pushRoute('locationService'))
            //.catch((err) => this.props.showError(err))
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
        const {name, username} = this.state;
        Promise.all(allPromises)
            .then(() => {if(!atleastOneTrue) throw new Error('Blank Input')})
            .then(() => {this.saveUserData()})
            .catch((error) => this.props.showError({message: error.message, title:'Signup Error'}))
    }

  register(field){
    let s = this.state.fields;
    s.push(field);
    this.setState({fields: s})
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
       
      this.setState({
        avatarSource: source1,
        photoUploaded: true,
        isImageStyleBlank: false
      });
      }
    })

  }
    renderContent1(){
        let imageStyle = (this.state.isImageStyleBlank) ? styles.blankImageStyle : styles.uploadedImageStyle;
        return(
        <View style={Object.assign({},baseStyle.bg,{padding: 5})}>
            <TouchableOpacity onPress={this.onPhotoPress.bind(this)} style={{flex:1}}>
              <Image source={this.state.avatarSource} style={imageStyle} />
              <Text style={Object.assign({},styles.conditionText,{alignSelf: 'center'})}> Add Profile Photo </Text>
            </TouchableOpacity>
            
            <View style={{marginTop:0, paddingLeft:40, paddingRight:40}}>
            <FormInput style={_.assign({}, baseStyle.input)}
              
              onChangeText={name => this.setState({ name })}
              ctype='name'
              onComponentMounted={(val) => this.register(val)}
              autoCapitalize='words'
              title='Full Name'
              autoFocus={true}
              />
            <View style={{padding: 10}}></View>
           <FormInput
              onChangeText={username => this.setState({ username })}
              ctype='username'
              onComponentMounted={(val) => this.register(val)}
              title='Username'
              />
            <View style={{padding: 10}}></View>
            <FormInput 
              
              onChangeText={location => this.setState({ location })}
              ctype='text'
              value={this.state.location}
              onComponentMounted={(val) => this.register(val)}
              title='City'
            />
              <Button primary rounded style={Object.assign({},baseStyle.normalButton,{marginTop: 18, justifyContent: 'center',backgroundColor: '#5F7EFE',width:300})} onPress={() => this.handleSubmit()}>
                <Text style={baseStyle.buttonText}> Continue </Text>
            </Button>
            </View>
        </View>
        );
    }
    

    render(){
        return(
        <Container theme={theme}>
                <Content style={{backgroundColor:'#FFF'}} keyboardShouldPersistTaps="always">
                <View style={{backgroundColor:'#D1D2D1'}} >
                    <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*4/8)})}/>
                </View>
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
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg)),
    }
}

export default connect(mapStateToDispatch, bindActions)(Profile)
