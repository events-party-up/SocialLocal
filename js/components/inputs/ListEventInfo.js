import React, {Component} from 'react';

import {View, AlertIOS, Animated, Image, LayoutAnimation,TouchableOpacity } from 'react-native';
import {Text, Card, CardItem, Thumbnail, Button, Icon, Right} from 'native-base';
import {Actions,ActionConst} from 'react-native-router-flux';

import baseStyle from '../../themes/base-styles';
import CountDownTimer from './countDownTimer';
import {WithEventSubscription} from '../misc/WithEventSubscription';
import InviteButton from './InviteButton';
import EventsControl from './eventsControl';
import {capitalize} from '../../helpers/utils';
import * as hm from './helpers';
import * as db from '../../helpers/db';

const logo  = require('../../../images/social-logo.png');
const blankphoto = require('../../../images/photo.png');
const test_url = "https://firebasestorage.googleapis.com/v0/b/socialvite-f804e.appspot.com/o/images%2F54370900-04c9-11e7-8565-115653711ed9?alt=media&token=4081e6e3-52ad-4397-bf9d-2c7dff266fe6";


class ListEventInfo extends Component{

    static propTypes ={
        onAddTime: React.PropTypes.func,
        onInvitationStatusChange: React.PropTypes.func,
        onMessage: React.PropTypes.func,
        onOptionsPress: React.PropTypes.func,
    }

    constructor(props){
        super(props);
        this.state ={
            fullView: false,
            userLocation: this.props.event.info.location
        }

        this.mount = true;
        
    }
    getDefaultImageUri(){
        if(this.props.event.info.images){
            return {uri: this.props.event.info.images[0]}
        }
        else 
            return logo
    }

    getSourceImage(source){
        if(source)
            return({uri: source})
        else  
            return blankphoto
    }

    getImage(event){
        if(event.info.images)
            return(
                <Image style={{flex: 1}} source={this.getDefaultImageUri()} style={{width: 88, height:88}} />
            )
        return <Image style={{flex: 1}} source={logo} style={{width: 88, height:88}}  />;

    }

    isOwnedEvent(){
        const  {uid, event} = this.props;
        return uid === event.info.owner.uid;
    }


    componentWillMount(){
        db.getUserImage(this.props.event.info.owner.uid).then((url)=> {
            hm.getUserRegion().then((region)=> this.mount && this.setState({event_owner_image: url,userLocation: region}) )
        })//this.setState({event_owner_image: url}) );
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount(){
        this.mount = false;
    }

    onPress(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
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

    getGoingStatus(){
        
        const  {uid, event} = this.props;
        if(event.users && event.users[uid] === 'going')
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
            return(<TouchableOpacity onPress={this.props.onInvitationStatusChange} style={{alignItems:'flex-start'}} >
                    <Icon name='ios-radio-button-off-outline' style={{color:'#26CE99',fontSize:23}}  />
                </TouchableOpacity>);
        }
                
    }

    render(){
        const event = this.props.event;
        event['id'] = this.props.eventId
      return(
        <View> 
          <TouchableOpacity style={{height:120,padding:16,paddingRight:16}} onPress={()=>this.props.onPress(this.props.event)} >
            <Animated.View 
                style={_.assign({},{flexDirection:'row'}, this.props.style)}
            >
             <View style={{flex:1, justifyContent:'flex-start'}}>
                        {this.getImage(event)}
                    </View>
              <View style={_.assign({},styles.content,{height:88})}>
                <View style={{flexDirection:'row',flex:1}}>
                  <View style={{flexDirection:'column',flex:1,}} >       
                    <View style={{flex: 1,flexDirection:'row',}}>
                      <TouchableOpacity style={{justifyContent:'flex-start'}} onPress={()=>{db.getUserByUid(event.info.owner.uid)
                                                                                            .then((user)=> { Actions.tab5({type: ActionConst.REFRESH}); return user; })
                                                                                            .then((user)=> {(event.info.owner.uid === this.props.uid ) ? Actions.popTo('Profile_screen') : Actions.viewProfile({friend: user, isFriendsView: true})} ) }}>
                          <Image style={{width: 30, height: 30, borderRadius: 15, margin: 2, marginLeft: 0}} source={this.getSourceImage(this.state.event_owner_image)}/>
                      </TouchableOpacity>
                      <Text style={{fontSize:11,fontFamily:'worksans-regular', marginTop: 7,marginLeft:10}}>{capitalize(event.info.owner.name)}</Text>    
                    </View>
                    <View style={{flexDirection:'row',marginTop:10, flex:2}}>
                      <Text style={styles.text} numberOfLines={2}>{capitalize(event.info.name)} @ {capitalize(event.info.location.address)}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'column',justifyContent:'flex-start',flex:0.2}}>
                          <TouchableOpacity style={{justifyContent:'center',flex:1,marginTop:-16,marginRight:-16}}  onPress={ ()=> {  event['id']=this.props.eventId;  this.props.onOptionsPress(event)} } >
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
              

            </Animated.View>        
          </TouchableOpacity>
          <View style={{height:1, backgroundColor:'#B2B2B2'}} ></View>
        </View>
      )
    }
}

const styles = {
    container:{
        flex: 1,
        flexDirection:'row',
        height:160,
        backgroundColor:'#FFF',
        width:null,
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
        lineHeight: 20,
        fontFamily:'worksans-regular'
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
    }

}
//export default MapEventInfo;
export default WithEventSubscription(ListEventInfo);