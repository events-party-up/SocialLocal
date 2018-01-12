import React, {Component} from 'react';

/* Open source modules */
import {View, Image,TabBarIOS , ActionSheetIOS, NavigationExperimental, InteractionManager,PushNotificationIOS,Platform,TouchableOpacity} from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title  } from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions, ActionConst, DefaultRenderer} from 'react-native-router-flux';
const Permissions = require('react-native-permissions');
import SplashScreen from 'react-native-splash-screen'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import HeaderContent from '../inputs/Header';
import FormInput from '../inputs';
import Map from '../inputs/Map'
import AnimatedView from '../inputs/AnimatedView'
import {FirebaseToState, stateToFirebase } from '../../actions/listeners'
import Tabs from './tabs';
import BoxDrawer from '../inputs/boxdrawer'
import {syncToStore,resetRoute, pushRoute, popRoute, showError} from '../../actions/login';
import {openDrawer} from '../../actions/drawer';
import {WithSubscription} from '../misc/WithSubscription';
import * as db from '../../helpers/db';
import {addTime, onInvitationStatusChange,endParty} from '../../actions/events';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const listIcon  = require('../../../images/List.png');
const findPeopleIcon = require('../../../images/find-people.png')
/* Component class */


class Home extends Component{
  
    constructor(props, context){
      PushNotificationIOS.setApplicationIconBadgeNumber(2)
        super(props,context);
        this.drawer = context.drawer;
        this.state = {
            selectedTab: 'welcome',
            page: 'maps',
            markers:[],
            isReady: false
        }
        this.mount = true;
        
        this.ownerDrawList = [

          {  
             text: 'Edit The Party',
             onClicked:((event)=> this.pushToEdit(event) )
            },
            {
             text: 'Message',
             onClicked:((event)=> this.pushToMessage(event))
             
            },
            { 
             text: 'Mute Notifications',
             onClicked:((event)=> db.pushToMute(event.id,this.props.uid,this.getMuteStatus(event)) )
            },
            {
             text: 'End The Party',
             onClicked:((event)=> {db.finishParty(event.id);} )
             
            }
        ];

        this.invitedDrawList = [

          {  icon: 'ios-clock-outline',
             text: 'Join The Party',
             onClicked:((event)=> { props.onInvitationStatusChange(event,props.uid,!this.getGoingStatus(event)) } )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Message',
             onClicked:((event)=> this.pushToMessage(event))
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Mute Notifications',
             onClicked:((event)=> db.pushToMute(event.id,this.props.uid,this.getMuteStatus(event)) )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Remove From Feed',
             onClicked:((event)=> db.removeFromFeed(event.id,this.props.uid) ) 
            }
        ];  

        // debounce version of lat long
        this.setUserLatLong = _.debounce(this.setUserLatLong, 1000);
    }

    getGoingStatus(event){
        const {uid} = this.props;
        if(event.users && event.users[uid] === 'going')
            return true;
        else
            return false;
    }

    getMuteStatus(event){
      return (event.users_muted && event.users_muted[this.props.uid] === 'muted')
    }


    showActionSheet(event){   
      renderActionButtons = (this.props.uid === event.info.owner.uid )? this.ownerDrawList : this.invitedDrawList
      let buttons = _.map(renderActionButtons,(val) => val.text);
      if(this.props.uid !== event.info.owner.uid )
        buttons[0] =  (this.getGoingStatus(event))? "Leave The Party": "Join The Party"
      buttons[2] = (this.getMuteStatus(event))? "Unmute Notifications" : "Mute Notifications"
      buttons.push('Cancel');

      ActionSheetIOS.showActionSheetWithOptions({
        options: buttons,
        title:event.info.name,
        cancelButtonIndex: buttons.length-1
      },
        (buttonIndex)=>{
          // call the callback
          renderActionButtons[buttonIndex] && 
          renderActionButtons[buttonIndex].onClicked && 
          renderActionButtons[buttonIndex].onClicked(event)
        }
      )
    }

    pushToEdit(event){
        this.props.pushRoute({ key: 'editParty', event, eventId: event.id })
    }

    pushToMessage(event){
      p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
      p.then(()=> Actions.tab2({type:ActionConst.REFRESH}) )
      .then(()=>Actions.chat({group: event,type: ActionConst.PUSH,fromEvent:true ,title: event.info.name }) )
        // Actions.tab2({type:ActionConst.JUMP})
        // this.props.pushRoute({key: 'chat', group: event })
    }

    static contextTypes = {
      drawer: React.PropTypes.object,
    }

    componentWillUnmount(){
      this.mount = false;
      this.firebase && this.firebase();
      this.notificationListener.remove()
      this.refreshTokenListener.remove();
    }

    componentWillReceiveProps(nextProps){
      
      let {markers,events} = nextProps;
      if(!nextProps.isReady){
          this.mount && this.setState({markers, events, isReady:true})
          return;
      }
      if(nextProps.events.length !== 0 || (nextProps.events !== this.state.events))
        this.mount && this.setState({markers, events, isReady:true})
    }
   
    updateMarkers(){
      //TODO: add current latitude longitude.
      const latitude = null
      const longitude = null
      
      db.getNearbyEvents2(latitude, longitude, this.props.uid)
        .then(({partyon, events}) => {
          
          let eventsListComplete = _.concat(partyon, events);
          let markers = []
          let eventsList = []
          let blockedUsers = Object.assign({}, this.props.user.blockedUsers);
          eventsListComplete.map((event, i)=> {
            if(!blockedUsers[event.info.owner.uid]){
              markers.push(event)
              eventsList.push(event.id)
            }
          })
          this.mount && this.setState({markers, events:eventsList, isReady:true})
        }).catch((e)=>{} )
    }


    mainNavigationWithoutMarker(route){
      const position = this.map.currentRegion;
      this.props.pushRoute({ key: route, data: position});
    }

    mainNavigationWithMarker(route, event){
      // get current location
      const position = this.map.currentRegion;
      this.props.pushRoute({ key: route, event, eventId: event.id, onOptionsPress: (event) => this.showActionSheet(event)});
    }

    componentDidMount(){
      // start the listener forever
      //this.firebase = this.props.FirebaseToState();
      this.props.FirebaseToState();
      Actions.refresh({renderLeftButton: ()=>this.renderLeftNavbarButton() })
      
      InteractionManager.runAfterInteractions(() => {
          //this.setState({isReady: false })
          SplashScreen.hide();
      })
       FCM.requestPermissions(); // for iOS
         FCM.getFCMToken().then(token => {
            console.log("Token.............", token);    
      //       // store fcm token in your server
            let userData = {}
            if(token != null){
              userData['fcmToken'] = token
              this.props.syncToStore(userData);
            }
        });
        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if(notif.local_notification){
              //this is a local notification
            }
            if(notif.opened_from_tray){
              //app is open/resumed because user clicked banner
              switch(notif.notificationType){
                case "message":
                  db.getEventData(notif.notificationDataId)
                  .then((event)=> {event['id'] = notif.notificationDataId ; this.pushToMessage(event)} )
                break;
                case "follow":
                  db.getUserByUid(notif.notificationDataId)
                  .then((user)=> { Actions.tab5({type: ActionConst.REFRESH}); Actions.viewProfile({friend: user, isFriendsView: true}) } )
                break;
                case "event":
                  db.getEventData(notif.notificationDataId)
                  .then((event)=> {event['id'] = notif.notificationDataId ; this.mainNavigationWithMarker('mapinfo', event)} )
                break;
              }
            }

            if(Platform.OS ==='ios'){
              //optional
              //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link. 
              //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
              //notif._notificationType is available for iOS platfrom
              switch(notif._notificationType){
                case NotificationType.Remote:
                  notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                  break;
                case NotificationType.NotificationResponse:
                  notif.finish();
                  break;
                case NotificationType.WillPresent:
                  notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                  break;
              }
            }
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            console.log("tokens are refreshed")
            let userData = {}
            if(token != null){
              userData['fcmToken'] = token
              this.props.syncToStore(userData);
            }
            // fcm token may not be available on first load, catch it here
        });



    }

    renderRightNavbarButton(){
      return( <TouchableOpacity style={{padding:2}} onPress={()=> {Actions.findPeopleHome({type: ActionConst.PUSH, index: this.index, event: this.props.event, eventId: this.props.eventId, user: this.props.user}) } } > 
                <Image source={findPeopleIcon} />
              </TouchableOpacity>
        );

    }

    renderLeftNavbarButton(){
      return( <TouchableOpacity style={{padding:5}} onPress={()=> Actions.List({type: ActionConst.REPLACE, index: this.index, event: this.props.event, eventId: this.props.eventId}) } > 
                <Image source={listIcon}  />
              </TouchableOpacity>
        );
    }

    componentWillMount(){
      //Actions.refresh({renderLeftButton: (()=>this.renderLeftNavbarButton()) })
      //TODO 1 for location pemissions
      // Permissions.check('location')
      //   .then((response)=> {
      //     if(response === 'denied'){
      //       // move to noop in case location is not authorized
      //       this.props.resetRoute('noop');
      //     }
      //   })
    }

    pushRoute(route){
        this.props.pushRoute({ key: route })
    }

    setUserLatLong(latLong){
      
      this.props.syncToStore({latLong: latLong});
    }

    popRoute(route){
        this.props.popRoute();
    }

    render(){
        return(
          <Container theme={theme}>
                
                <Image source={glow2} style={baseStyle.container}>
                    
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                      <View style={styles.bg}>

                        <Map ref={(map) => {this.map = map;}}
                            markers={this.state.markers}
                            onPressInfo={(event)=> { this.mainNavigationWithMarker('mapinfo', event)}}
                            onShowStatus={(event)=> this.mainNavigationWithMarker('partyList',event)}
                            active={this.state.isReady}
                            uid={this.props.uid}
                            user={this.props.user}
                            resetRoute={this.props.resetRoute}
                            getLatLong={(latLong) => this.setUserLatLong(latLong) }
                            onAddTime={this.props.addTime}
                            onCounTDownEnd={()=> {this.updateMarkers()} }
                            onInvitationStatusChange={this.props.onInvitationStatusChange}
                            onOptionsPress={ (event)=> this.showActionSheet(event)}
                        />
                        </View>
                    </View>
                  </Image>
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
    tabsNavigation: state.tabsNavigation,
    uid: state.login.uid,
    user: state.login.user,
    messages: state.messages
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         FirebaseToState: () => dispatch(FirebaseToState()),
         openDrawer:() => dispatch(openDrawer()),
         resetRoute:(key) => dispatch(resetRoute(key)),
         addTime:(event)=>dispatch(addTime(event)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         endParty:(event_id)=> dispatch(endParty(event_id)),
         onInvitationStatusChange:(event,uid,status)=> dispatch(onInvitationStatusChange(event,uid,status))
    }
}

var home = connect(mapStateToDispatch, bindActions)(Home)

//export default home;
export default WithSubscription(home);
