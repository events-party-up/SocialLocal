import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity } from 'react-native'
import { Container, Text, Content, Button,Picker, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {Actions, ActionConst} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, resetRoute, popRoute,_signOut} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import {DEFAULT_LOCATION} from '../../helpers/constants';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/AddPhoto.png');
const logo  = require('../../../images/social-logo.png');


/* Component class */

class Profile extends Component{

    constructor(props){
        super(props);
        const {name, username, photo,city, about} = this.props.user;

        let newcity = city;
        if(city === ""){
            newcity = DEFAULT_LOCATION
        }

        this.state = {
            name,
            username,
            bio:about,
            location:newcity,
            fields: [],
            photoUploaded: false,
            loading:false,
            isImageStyleBlank: true
        }

        if(photo){
            this.state.avatarSource={uri:photo};
            this.state.isImageStyleBlank = false;
        }else
            this.state.avatarSource= blankphoto;
    }

    componentDidMount(){
         Actions.refresh({onRight: this.handleSubmit.bind(this)})
    }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(){
        this.props.popRoute();
    }

    saveUserData(user){
        
        const {name, username, avatarSource, bio,location, photoUploaded} = this.state;
        
        this.setState({loading: true})
        if(photoUploaded)
            return ImageResizer.createResizedImage(avatarSource.uri, 128,128,'JPEG',100)
                .then((resizedImageUri)=> db.uploadPhoto3({uri: resizedImageUri}))
                .then((photo) => this.props.syncToStore({name, username, about: bio, city: location, photo}))
                .then(()=> this.setState(
                        {loading:false}, ()=> this.popRoute())
                    )

        else{
          this.props.syncToStore({name, username, about: bio, city: location })
          this.setState({loading:false}, ()=> this.popRoute())
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
            .catch((error) => this.props.showError({message: error.message, title:'SIGNUP Error!'}))
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
    });
  }

  getSourceImage(source){
    if(source ===  '')
      return blankImage
    else
      return({uri: source})
    }

    renderContent1(){
        let imageStyle = (this.state.isImageStyleBlank) ? styles.blankImageStyle : styles.uploadedImageStyle;
        return(
        <View style={_.assign({}, baseStyle.bg, {paddingLeft: 0, paddingRight: 0})}>
          <TouchableOpacity onPress={this.onPhotoPress.bind(this)}>
            <Image style={imageStyle} source={this.state.avatarSource} />
          </TouchableOpacity>
            
            <FormInput
              onChangeText={name => this.setState({ name })}
              style={{paddingRight: 16, paddingLeft: 16}}
              ctype='name'
              value={this.state.name}
              onComponentMounted={(val) => this.register(val)}
              title='Name'
              autoCapitalize='words'
            />

           <FormInput 
              onChangeText={username => this.setState({ username })}
              style={{paddingRight: 16, paddingLeft: 16}}
              ctype='username1'
              value={this.state.username}
              onComponentMounted={(val) => this.register(val)}
              title='Username'
              disabled={true}
            />
              
           <FormInput 
              onChangeText={bio => this.setState({ bio })}
              style={{paddingRight: 16, paddingLeft: 16}}
              ctype='bio'
              value={this.state.bio}
              autoCorrect={true}
              autoFocus={true}
              autoCapitalize="sentences"
              onComponentMounted={(val) => this.register(val)}
              title='About'
              multiline= {true}
            />

            <FormInput 
              style={{paddingRight: 16, paddingLeft: 16}}
              onChangeText={location => this.setState({ location })}
              ctype='text'
              value={this.state.location}
              onComponentMounted={(val) => this.register(val)}
              title='City'
            />

               
            
        </View>
        );
    }
    

    render(){
        
        return(
        <Container theme={theme}>
                <Content style={{backgroundColor:'#FFF'}} keyboardShouldPersistTaps="always">
                
                <Image source={glow2} style={baseStyle.containerDevice}>
                    <Spinner visible={this.state.loading}/>
                    <View style={{flex:3,justifyContent:'flex-end'}}>
                        {this.renderContent1()}
                    </View>
                    <View style={{flex:1,justifyContent:'flex-end'}}/>
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
         resetRoute:(route) => dispatch(resetRoute(route)),
         _signOut: () => dispatch(_signOut())

    }
}

export default connect(mapStateToDispatch, bindActions)(Profile)