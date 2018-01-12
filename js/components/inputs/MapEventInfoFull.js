import React, {Component} from 'react';


import {View, Animated, Image, UIManager, Dimensions, TouchableHighlight,TouchableOpacity, findNodeHandle, InteractionManager, Text, LayoutAnimation , ActionSheetIOS } from 'react-native';
import {Container, Header, Content,Title, Card, CardItem, Thumbnail, Button, Icon,Picker,Item} from 'native-base';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions, ActionConst} from 'react-native-router-flux';
//import openMap from 'react-native-open-maps';
import { Linking } from 'react-native';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import Map from './Map';
import CountDownTimer from './countDownTimer';
import {WithEventSubscription} from '../misc/WithEventSubscription';
import InviteButton from './InviteButton';
import EventsControl from './eventsControl';


import ActionFFButton from './ActionFFButton';
import ImageSlider from 'react-native-image-slider'
//import ImageSlider from 'react-native-elastic-image-slider';
import FormInput from './index';
import {locations,DURATION,ADD_DURATION} from '../../helpers/constants';
import * as db from '../../helpers/db';
import {showEventActionSheet,pushToMessage} from '../../actions/events';
import * as hm from './helpers';
import {capitalize} from '../../helpers/utils';
import {LocationPickerMap} from './pickLocationFromMap';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/Artboard.png');
const blankphoto = require('../../../images/party1.jpg');
const blankImage = require('../../../images/photo.png');
const nextScreen = require('../../../images/Next-Screen.png');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


function openMap(data){
    const {latitude, longitude, name } = data
    //url="http://maps.apple.com?ll="+latitude+","+longitude+"&q="+name+"&dirflag=d"
    url="http://maps.google.com?center="+latitude+","+longitude+"&q="+name+"&directionsmode=driving"
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
}

class MapEventInfoFull extends Component{

    constructor(props){
        super(props);
        this.state ={
            fullView: false,
            isReady:false,
            marker:null,
            timeToggle:false,
            addTime:1,
            distance: null,
            travelPath:[]
        }
        db.getUserImage(props.event.info.owner.uid).then((url)=> this.setState({event_owner_image: url}) )
        
    }

    static defaultProps ={
        event : { 
                id:'-K_q-VMtSpBL16bufBMN',
                info: { name: 'Erica Haims 30th Birthday Party', 
                        photo:"https://firebasestorage.googleapis.com/v0/b/socialvite-f804e.appspot.com/o/images%2F452daae0-cfe5-11e6-9c5e-e79ceea991cb?alt=media&token=be618d5c-323e-4962-b1a3-3c7d77779f51",
                        message: 'Hey guys, lets get some drinks at Barcadia for my birthday. Will probably be here for a few hours.'
                }
        }
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.setState({isReady: true , marker: this.props.event})
        })
    }



    getImage(event){
        if(event.info.images)
            return(
                      <ImageSlider  style={{backgroundColor:'white', height: 200 }} height={200}  images={event.info.images} />
            )
            else
                return   <ImageSlider  style={{backgroundColor:'white', height: 200 }} height={200}  images={[logo]} />
        
    }

    pushRoute(route){
        const {event, eventId} = this.props;
        event['id']=eventId;
        this.props.pushRoute({ key: route, event, eventId })
    }

    popRoute(){
        this.props.popRoute()
    }

    onMessageClicked(){

    }
    getSourceImage(source){
        if(source)
          return({uri: source})
        else
          return blankImage
    }

    onAddTimeClicked(event,hours){
        this.props.addTime(event,hours,this.props.user);        
    }

    renderRightNavbarIcon(){
        return(
            <View>
              <Icon
                name='ios-more'
                style={{color: 'white'}}
                onPress={() => showEventActionSheet(this.props.event,this.props.uid) }
              >
              </Icon>
            </View>
            );
    }

    setNavigation(){  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let origin={latitude: this.props.event.info.location.latitude,longitude: this.props.event.info.location.longitude  } ;
          let destination = { latitude: position.coords.latitude,longitude: position.coords.longitude };
          let distance= hm.longLatDistance(position.coords.latitude,position.coords.longitude,this.props.event.info.location.latitude,this.props.event.info.location.longitude) 
          hm.getDirection(origin,destination).then((result)=> {  this.setState({travelPath: result,distance: distance })} )
        },
        (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      )
    }

    componentWillMount(){
      Actions.refresh({ renderRightButton: (() => this.renderRightNavbarIcon())})
    }

    componentWillReceiveProps(nextProps){
        if(this.props.event.info.name !== nextProps.event.info.name){
            // do Action refresh for title change
            Actions.refresh({ title: nextProps.event.info.name })
        }
        this.setNavigation();
        let event = nextProps.event
        event['id'] = nextProps.eventId

        this.setState({marker: event})
    }


    getInvitedGoingStatus(event){
        let invited = 0, going = 0;
        _.map(event.users,function(val, key){
            if(val === "invited" || val === "going" || val === "not going")
              invited+=1;
            if(val === "going")
                going = going + 1;
        })        

        let statusList =   [<Text key={1} style={Object.assign({},baseStyle.conditionText,{fontSize:12})}>{going} </Text>,
                            <Text key={2} style={Object.assign({},baseStyle.conditionText,{fontSize: 12})}> Going </Text>,
                            <Text key={3} style={Object.assign({},baseStyle.conditionText,{fontSize:15, marginTop: -2})}> | </Text> ,
                            <Text key={4} style={Object.assign({},baseStyle.conditionText,{fontSize:12})}>{invited} </Text> ,
                            <Text key={5} style={Object.assign({},baseStyle.conditionText,{fontSize:12})}> Invited </Text>
                            ]
        return statusList;
        
    }

    getGoingStatus(){
        const {event, uid} = this.props;
        if(event.users && event.users[uid] === 'going')
            return true;
        else
            return false;
    }

    isOwnedEvent(){
        const  {uid, event} = this.props;
        return uid === event.info.owner.uid;
    }

    getInvitationButton(){
        return(
            <ActionFFButton
              style={{height:44, width: '100%'}}
              active={this.getGoingStatus()}
              inactiveText='Join The Party'
              activeText='Attending'
              onPress={this.props.onInvitationStatusChange.bind(this,{id:this.props.eventId},this.props.uid)}
            />
            );
    }



    moveToUserProfile(event){
        const{user} = this.props;
        db.getUserByUid(event.info.owner.uid)
            .then((friend)=> {Actions.tab5({type:ActionConst.REFRESH}) ; return friend} )
            .then((friend)=> { 
                if(friend.uid === user.uid)
                    Actions.popTo('Profile_screen')
                else{
                    Actions.viewProfile({friend: friend, isFriendsView: true})
                }
            })
    }

    renderContent(){
        const {event} = this.props;
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{flex:1, justifyContent: 'center', flexDirection:'row', width: null, height: 220, backgroundColor: 'white'}} >
                     {this.getImage(event)}
                </View>
                <View style={{margin: 16}}>
                {this.getInvitationButton()}
                </View>
                <View style={baseStyle.line}/>
                <View>
                    <View style={{flex:1,flexDirection:'row', padding: 16}}>
                      <TouchableOpacity onPress={()=> this.moveToUserProfile(event)} >
                        <Image style={{width: 40, height: 40, borderRadius: 20}} source={this.getSourceImage(this.state.event_owner_image)} />
                      </TouchableOpacity>
                      <View style={Object.assign({},{flex:1, marginLeft: 10})} >
                      <Text style={Object.assign({},styles.text,{fontSize:16, marginTop:3,flex:1})} numberOfLines={2} >{event.info.name}</Text>
                      <Text style={Object.assign({},styles.text,{fontSize:11, marginTop:3})}>{event.info.message}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={Object.assign({},styles.information,{alignItems:'center', padding: 16})} onPress={() =>this.pushRoute('invitedMembers')} >
                        <View style={{flex:1, flexDirection:'row'}} >
                            <View style={{flex: 1, flexDirection:'row'}}>{this.getInvitedGoingStatus(event)}
                            </View>
                        </View>
                        <CountDownTimer
                         style={Object.assign({},baseStyle.conditionText,{fontSize:15,color:'#5F7EFE'})} event={event}/>
                    </TouchableOpacity>
                </View>
                <View style={baseStyle.divider}>
                  <Text style={baseStyle.dividerText}>LOCATION </Text>
                </View>
                <View style={{margin:16}}>
                <TouchableOpacity style={{flexDirection:'row', marginBottom:10}} onPress={() => openMap({ povider: "google", latitude: this.props.event.info.location.latitude, longitude: this.props.event.info.location.longitude, name: this.props.event.info.location.address })}>
                                <Text style={Object.assign({},{fontFamily:'worksans-regular',paddingRight:15, fontSize: 12,flex:1, justifyContent:'flex-start'})}>{event.info.location.address}</Text>
                                <Text style={Object.assign({},baseStyle.conditionText,{fontSize: 12,justifyContent:'flex-end',textAlign:'right'})}> {this.state.distance } Away</Text>               
                    </TouchableOpacity>
                     <Map height={175} onlyMarker={true} active={this.state.isReady} 
                            marker={this.state.marker} path={true} pathCoordinates={this.state.travelPath}
                            relocateX={10} relocateY={20}
                             />
                     <Button rounded
                       onPress={()=>{pushToMessage(event)}}
                       style={Object.assign({},styles.solidButton,{backgroundColor:'#5F7EFE',alignSelf:'stretch',marginTop: 16, height:44, justifyContent: 'center'})} >
                       <Text style={styles.buttonText}> Message </Text>
                     </Button> 
                </View>        
            </View>
        )
    }

    getTimeToggleView(event){
      
      if(this.state.timeToggle){
        return(
        <View style={{margin: 16}}>
          <View  style={Object.assign({},styles.information,{borderColor:'white'})}>
            <Text style={{flex:1,alignSelf:'flex-start'}}>+ Add Time </Text>
            <CountDownTimer style={Object.assign({},baseStyle.conditionText,{justifyContent:'center',fontSize:15,color:'red', marginTop: -12})} event={event}/>
            <TouchableOpacity onPress={()=> this.setState({timeToggle: !this.state.timeToggle})} >  
              <Icon style={{color:'red',justifyContent:'center',fontSize:30,paddingLeft:10, marginTop: -9}} name='ios-close-outline'/>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 10}}>
            <View style={{borderWidth: 1}} >
              <FormInput 
                onChangeText={duration => {this.setState({ addTime: duration })} }
                value={this.state.addTime}
                ctype='duration'
                style={{justifyContent:'center'}}
                duration={ADD_DURATION}
                placeholder='Duration'
              />
            </View>
            <Button rounded
             onPress={()=>{ this.onAddTimeClicked(this.state.marker,this.state.addTime); this.setState({ addTime:1, timeToggle: !this.state.timeToggle})} }
             style={Object.assign({},styles.solidButton,{backgroundColor:'#5F7EFE',alignSelf:'stretch',marginTop:16, marginLeft: 0,height:44, justifyContent: 'center'})} >
                 <Text style={styles.buttonText}> Add Time </Text>
            </Button>
          </View>
        </View>
        );
      }
      else{
        return(
        <TouchableOpacity style={_.assign({}, styles.information, {padding: 16})} onPress={()=> this.setState({timeToggle: !this.state.timeToggle})} >
                  <Text style={{flex:1,alignSelf:'flex-start'}}>+ Add Time</Text>
                  <CountDownTimer
                           style={Object.assign({},baseStyle.conditionText,{fontSize:15,color:'#5F7EFE'})} event={event}/>
        </TouchableOpacity>
        );
      }
    }

    renderContent2(){
        const {event} = this.props;
        
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{flex:1, justifyContent: 'center', flexDirection:'row', width: null, height: 220, backgroundColor: 'white'}} >
                     {this.getImage(event)}
                </View>
                {this.getTimeToggleView(event)}
                <View style={baseStyle.line}/>
                <View>
                    <View style={{flex:1,flexDirection:'row', padding: 16}}>
                      <TouchableOpacity  onPress={()=> this.moveToUserProfile(event)} >
                        <Image style={{width: 40, height: 40, borderRadius: 20}} source={this.getSourceImage(this.state.event_owner_image)} />
                      </TouchableOpacity>
                      <View style={_.assign({}, {flex: 1, marginLeft: 10})} >
                        <Text style={Object.assign({},styles.text,{fontSize:16, marginTop:3})}>{capitalize(event.info.name)}</Text>
                        <Text style={Object.assign({},styles.text,{fontSize:11, marginTop:3, flex: 1})}>{capitalize(event.info.message)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={Object.assign({},styles.information,{alignItems:'center', padding: 16})} onPress={() =>this.pushRoute('invitedMembers')} >
                        <Text>People</Text>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <View style={{flex: 1, flexDirection:'row',justifyContent:'flex-end'}}>
                                {this.getInvitedGoingStatus(event)}
                            </View>
                        </View>
                        <Image source={nextScreen} style={{alignSelf:'center',marginLeft:5}} name='ios-arrow-forward'/>
                    </TouchableOpacity>
                </View>
                <View style={baseStyle.divider}>
                  <Text style={baseStyle.dividerText}>LOCATION  </Text>
                </View>
                <View style={{margin:16}}>
                <TouchableOpacity style={{flexDirection:'row', marginBottom:10}} onPress={() => openMap({povider: "google",  latitude: this.props.event.info.location.latitude, longitude: this.props.event.info.location.longitude, name: this.props.event.info.location.address })}>
                    <Text style={Object.assign({},{fontFamily:'worksans-regular',paddingRight:15, fontSize: 12,flex:1, justifyContent:'flex-start'})}>{event.info.location.address}</Text>
                    <Text style={Object.assign({},baseStyle.conditionText,{fontSize: 12,justifyContent:'flex-end',textAlign:'right'})}>  {this.state.distance } Away </Text>               
                  </TouchableOpacity>
                  
                    <Map height={175} onlyMarker={true} active={this.state.isReady} 
                        marker={this.state.marker} path={true} pathCoordinates={this.state.travelPath} 
                        relocateX={10} relocateY={20}
                  
                    />
                  
                  <Button rounded
                     onPress={()=>{pushToMessage(event)}}
                     style={_.assign({},styles.solidButton,{backgroundColor:'#5F7EFE',alignSelf:'stretch',marginTop:16,height:44, justifyContent: 'center'})} >
                     <Text style={styles.buttonText}> Message </Text>
                   </Button>

                   <Button rounded
                     onPress={()=>{this.props.endParty(this.props.eventId)}}
                     style={Object.assign({},styles.solidButton,{backgroundColor:'#5F7EFE',alignSelf:'stretch',marginTop:16,height:44, justifyContent: 'center'})} >
                     <Text style={styles.buttonText}> End Party </Text>
                   </Button> 
                </View>
            </View>
        )
    }

    onContextMenu(){
      this.pushRoute('partyDetails');
    }

    render(){
        const {event} = this.props;
      return(
        <Animated.View 
            style={Object.assign({},styles.container, this.props.style)}
        >
         <Content theme={theme} >
            <Image source={glow2} style={baseStyle.container}>
              <View style={{flex:1,justifyContent:'flex-start'}}>
                    { (this.props.uid === this.props.event.info.owner.uid )? this.renderContent2() : this.renderContent() }
              </View>
            </Image>
        </Content>
        </Animated.View>
      )
    }
}

const styles = {
    container:{
      flex:2,
      justifyContent:'space-around'
    },
    text:{
        ...baseStyle.regulartext,
        textAlign:'left'
    },
    card:{
        flex: 1,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'stretch',
        
    },
    content:{
        marginBottom:10,
    },
    information:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#d3d3d3',
        borderBottomColor:'transparent'
    },
    cardContent:{
        backgroundColor:'#FFF',
        marginLeft:8
    },
    cardContentButton:{
        backgroundColor:'#FFF',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    },
    cardImage:{
        backgroundColor:'#FFF',
        alignItems:'stretch',
        height:60
    },
    button:{
        ...baseStyle.normalButton2,
        paddingLeft:40,
        paddingRight:40,   
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: 'worksans-medium'
    }
}

export default WithEventSubscription(MapEventInfoFull);
