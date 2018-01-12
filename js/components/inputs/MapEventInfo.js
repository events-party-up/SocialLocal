import React, {Component} from 'react';

import {View, AlertIOS, Animated, Image, TouchableHighlight, LayoutAnimation,TouchableOpacity } from 'react-native';
import {Text, Card, CardItem, Thumbnail, Button, Icon} from 'native-base';

import baseStyle from '../../themes/base-styles';
import MapEventInfoFUll from './MapEventInfoFull';
import CountDownTimer from './countDownTimer';
import {WithEventSubscription} from '../misc/WithEventSubscription';
import InviteButton from './InviteButton';
import EventsControl from './eventsControl';
import {Actions,ActionConst} from 'react-native-router-flux';
var Analytics = require('react-native-firebase-analytics');

import {capitalize} from '../../helpers/utils';
import * as db from '../../helpers/db';
import * as hm from './helpers'

const logo  = require('../../../images/social-logo.png');
const blankphoto = require('../../../images/photo.png');
class MapEventInfo extends Component{

    static defaultProps = {
        userLocation: {
            latitude: 37.1,
            longitude: -122
        }
    }

    constructor(props){
        super(props);
        this.state ={
            fullView: false,
            userLocation: this.props.userLocation || userLocation
        }
    }

    getImage(event){

        if(event.info.images)
            return(
                <Image style={{flex: 1}} source={this.getDefaultImageUri()} style={{width: 88, height:88}}/>
            )
        return <Image style={{flex: 1}} source={logo} style={{width: 88, height:88}} />;

    }

    getDefaultImageUri(){
        if(this.props.event.info.images){
            return {uri: this.props.event.info.images[0]}
        }
        else return logo
    }

    getSourceImage(source){
        if(source)
            return({uri: source})
        else
            return blankphoto
    }

    componentWillMount(){
        db.getUserImage(this.props.event.info.owner.uid)
           .then((uri)=> {this.setState({event_owner_image: uri })})
           .catch((e) => console.log('-----error here-----------',e) )
        LayoutAnimation.easeInEaseOut();
    }

    onPress(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({fullView: !this.state.fullView})
    }

    isOwnedEvent(){
        const  {uid, event} = this.props;
        return uid === event.info.owner.uid;
    }

    getGoingStatus(){
        const {event} = this.props;
        
        if(event.users && event.users[this.props.uid] === 'going')
            return true;
        else
            return false;
    }
    getRightIcon(){
        if(this.isOwnedEvent()){
            return(<View style={{flex:1}} />);
        }
        else if (this.getGoingStatus()){
        return (
                  <Icon name='ios-checkmark-circle' style={{color:'#26CE99',alignItems:'flex-end',flex:1,textAlign:'right',fontSize:23}}  />
                );
        }
        else{
            return(<View style={{flex:1}} />);
            return(<TouchableOpacity onPress={()=> this.props.onInvitationStatusChange(this.props.event,this.props.uid,true) } style={{alignItems:'flex-end'}} >
                      <Icon name='ios-radio-button-off-outline' style={{color:'#26CE99',fontSize:23}}  />
                    </TouchableOpacity>);
        }
    }

    getInvitedGoingStatus(event){
        let invited = 0, going = 0;
        _.map(event.users,function(val, key){
            if(val === "invited")
                invited = invited + 1;
            if(val === "going")
                going = going + 1;
        })        

        let statusList =   [<Text key={1} style={Object.assign({},baseStyle.regulartext,{fontWeight:'bold'})}> {invited} </Text>,
                            <Text key={2} style={baseStyle.regulartext}> Invited </Text>,
                            <Text key={3} style={Object.assign({},baseStyle.regulartext,{fontWeight:'bold'})}> {going} </Text> ,
                            <Text key={4} style={baseStyle.regulartext}> Going </Text>
                            ]
        return statusList;
        
    }

    getGoingCount(event){
        let count = 0;
        _.map(event.users,(value,key)=>{
            if(value=="going"){
                count = count + 1;
            }
        })
        return count;
        
    }

    render(){
        const {event} = this.props;
      return(
        <View style={{height: 120}}>
            
            <Animated.View style={_.assign({},{flexDirection:'row',padding:16,paddingRight:16}, this.props.style)}>
                <TouchableOpacity style={{flexDirection:'row',flex:1}} onPress={this.props.onPressInfo.bind(this,this.props.event)} >
                    <View style={{flex:1,marginRight:11,justifyContent:'flex-start'}}>
                        {this.getImage(event)}
                    </View>
                    <View style={_.assign({},styles.content,{height:88,})}>
                      <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flexDirection:'column',flex:1,}} >       
                            <View style={{flex: 1,flexDirection:'row'}}>
                                <TouchableOpacity style={{justifyContent:'flex-start'}} onPress={()=>{db.getUserByUid(event.info.owner.uid)
                                                                                              .then((user)=> { Actions.tab5({type: ActionConst.REFRESH}); return user; })
                                                                                              .then((user)=>{(event.info.owner.uid === this.props.uid ) ? Actions.popTo('Profile_screen') : Actions.viewProfile({friend: user, isFriendsView: true})} ) }}>
                                    <Image style={{width: 30, height: 30, borderRadius: 15, margin: 0, marginLeft: 0}} source={this.getSourceImage(this.state.event_owner_image)}/>
                                </TouchableOpacity>
                                <Text style={{fontSize:11,fontFamily:'worksans-regular', marginTop: 7,marginLeft:10}}>{capitalize(event.info.owner.name)}</Text>    
                            </View>
                            <View style={{flexDirection:'row',marginTop: 10, flex: 2}}>
                                <Text style={styles.text} numberOfLines={2}>{capitalize(event.info.name)} @ {capitalize(event.info.location.address)}</Text>
                            </View>
                        </View>
  

                        <View style={{flexDirection:'column',justifyContent:'flex-start',flex:0.2}}>
                          <TouchableOpacity style={_.assign({},styles.optionsButton, {})}  onPress={ ()=> {  event['id']=this.props.eventId;  this.props.onOptionsPress(event)} } >
                                <Icon name='ios-more' style={{textAlign:'auto',flex:1,alignSelf:'center', fontSize: 30}}  />
                            </TouchableOpacity>
                          {this.getRightIcon()} 
                        </View>
                      </View>  
                      <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                          <Text style={_.assign({},styles.rightHeaderText,{fontSize:11,flex:1})}>{this.getGoingCount(event)} Going &middot; {hm.longLatDistance(this.state.userLocation.latitude,this.state.userLocation.longitude,event.info.location.latitude,event.info.location.longitude) }</Text> 
                          <CountDownTimer countDownComplete={()=> console.log('event has finished') } style={_.assign({},styles.counterText,{color:'#5F7EFE',textAlign:'center',alignSelf:'flex-end'})} event={event} />
                      </View>     
                    </View>
                </TouchableOpacity>
            </Animated.View>  
        </View>
      )
    }

    componentWillReceiveProps(nextProps, nextState){
        if(this.props.fullView !== nextProps.fullView)
            this.setState({fullView: nextProps.fullView})
        if(this.props.userLocation !== nextProps.userLocation)
        this.setState({userLocation: nextProps.userLocation})
    }
}

const styles = {
    container:{
        backgroundColor:'#FFF'
    },
    card:{
        flex: 1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    cardContent:{
        backgroundColor:'#FFF',
        flex:4,
        marginLeft:8
    },
    cardContentButton:{
        flex:1,
        backgroundColor:'#FFF',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop: 10
    },
    cardImage:{
        flex:1,
        backgroundColor:'#FFF',
        alignItems:'stretch',
        height: 50
    },
    image:{
        flex:1,
        marginTop:10,
        marginRight: 10,
        marginLeft:10,
    },
    content:{
        flex: 2,
        flexDirection:'column',
        justifyContent:'space-around',
    },
    header:{
        marginTop:10,
        flexDirection:'row'
    },
    headerTextView:{
        
        flexDirection:'row',
    },
    headerText:{
        alignSelf:'flex-end',
        fontSize:15,
        color:'#5F7EFE',
        fontFamily:'worksans-regular'
    },
    rightHeaderText:{
        fontSize:11,
        fontFamily:'worksans-regular',
        color:'#9B9B9B',
        marginRight: 5
    },
    text:{
        flex:1,
        fontSize:15,
        // marginBottom:10,
        // paddingRight:20,
        fontFamily:'worksans-regular',
        lineHeight: 20,

    },
    middleText:{
        flex:1,
        color:'#9B9B9B',
        fontSize:11,
        fontFamily:'worksans-regular'
    },
    counterText:{
        fontSize:13,
        fontFamily:'worksans-regular',
        alignSelf:'flex-end',
        textAlign:'center',
        justifyContent:'space-between'  
    },
    information:{
        flex:1,
        fontSize:11,
        fontFamily:'worksans-regular'
    },
    button:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    optionsButton:{
        justifyContent:'center',
        flex:1,
        marginTop:-3,
        marginRight:-3,
    }
}
//export default MapEventInfo;
export default WithEventSubscription(MapEventInfo);
