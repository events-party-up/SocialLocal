import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity, InteractionManager,AlertIOS,PushNotificationIOS,ListView,Platform } from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {Actions, ActionConst,Router ,DefaultRenderer} from 'react-native-router-flux';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import { SwipeListView } from 'react-native-swipe-list-view';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, popRoute} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import {locations} from '../../helpers/constants';
import ActionFFButton from '../inputs/ActionFFButton';
import {SubscribeToNotification} from '../misc/SubscribeToNotification';
import CountDownTimer from '../inputs/countDownTimer';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const logo  = require('../../../images/social-logo.png');


/* Component class */

class NotificationList extends Component{

    constructor(props){
      super(props);
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
      this.state = {
        loaded: false,
        dataSource:  this.ds.cloneWithRows([]),
        isListEmpty: true,
        initialIndex: 0,
        viewFooter: true
      };
    }


    getNotificationsData(notifications){
      
      let self = this;
            
            
            promises = [];
            unwanted_notifications = [];
            
            _.forEach( notifications, function(notification_data,key){
              // notification type is not "follow" then it is invite.
              // in case of invite, check the timestamp and remove the notification.
              if(notification_data.type !== "follow"){
                
                // notification event timestamp is not same as event timestamp since we copy the timestamp from event to notification
                // but do not update it. Hence, below check is of no use.

                if(notification_data.data.event.finished_at && (notification_data.data.event.finished_at.timestamp > Date.now() ) ) {
                  promises.push(db.getEventData(notification_data.data.eventId)
                  .then((event)=> {
                    if(event){
                      notification_data_set=[];
                      if (event.info.finished_at.timestamp < Date.now())
                        notification_data_set['finished'] = true
                      else
                         notification_data_set['finished'] = false
                      
                      notification_data_set['event']=event;
                      
                      notification_data_set['eventId']=notification_data.data.eventId;
                      notification_data_set['user']=notification_data.data.user;
                      notification_data_set['type']=notification_data.type;
                      notification_data_set['key'] = key

                      return notification_data_set;
                    }
                  }));
                }
                else{
                  db.delete_notification(self.props.uid, key);
                }
              }
              else{
                // follow notifications 
                // remove after 2 days
                var time = new Date();
                time.setDate(time.getDate() - 2);
                time_stamp = time.getTime();
                if(notification_data.timestamp < time_stamp){
                  db.delete_notification(self.props.uid, key);
                  return;
                }
                
                promises.push(db.getUserByUid(notification_data.data.user.uid)
                .then((user)=>{
                  if(user){
                    notification_data_set=[];
                    notification_data_set['user']=user;
                    notification_data_set['type']=notification_data.type;
                    notification_data_set['key'] = key
                    
                    
                    return notification_data_set;
                  }
                }) )   
              }
            })
            
            Promise.all(promises).then((data)=>{
              data = _.without(data, undefined,null);
              if (data[0]){
                self.setState({loaded: true, isListEmpty: false , listViewData: data.reverse() }) 
              }
              else{
               self.setState({loaded: true, isListEmpty: true })  
              }

            });
        
    }  

    componentWillMount(){
        //this.getNotifications(this.props.user.blockedUsers);
    }
    componentDidMount() {
         
    }

    componentWillUnmount(){
     }

    componentWillReceiveProps(nextProps){
      
      if(nextProps.notifications && JSON.stringify(this.props) !== JSON.stringify(nextProps) ){ //this.props.notifications !== nextProps.notifications ){
        //notification_data = _.sortBy(nextProps.notifications, [function(o) { return o.timestamp; }]);
        this.getNotificationsData(nextProps.notifications);
        this.setState({viewFooter:true});
      }
      else{
        this.setState({loaded: true});
      }

      //this.getNotifications(nextProps.user.blockedUsers)
   }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(route){
        this.props.popRoute();
    }

    formatBoldText(text){
      return(<Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-semibold'}} >{text} </Text>)
    }

    formatRegularText(text){
      return(<Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}} >{text} </Text>)
    }

    _renderFooter(){
      if (!this.state.viewFooter)
        return;

      return(
      <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=> this.getMoreNotifications() } >
        <Text style={{textAlign:'center',margin:20,fontSize:14,color:'#333333'  ,width:100}}> Load More... </Text>
      </TouchableOpacity>
      )
    }

    getMoreNotifications(){
      db.getNotifications(this.props.uid).then((data)=> {
        this.setState({viewFooter: false});
        this.getNotificationsData(data)} );
    }

    
	closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
  }

  deleteRow(rowMap, rowKey, dbkey) {
    this.closeRow(rowMap, rowKey);
    db.delete_notification(this.props.uid, dbkey)
	}

    renderHiddenRow(data, secId, rowId, rowMap){
      
      return(
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ _ => this.closeRow(rowMap, `${secId}${rowId}`) }>
									<Text style={styles.backTextWhite}>Close</Text>
				</TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow.bind(this)(rowMap, `${secId}${rowId}`, data.key) }>
									<Text style={styles.backTextWhite}>Delete</Text>
				</TouchableOpacity>
      </View>
      )
    }

    renderContent1(){
      if(!this.state.loaded){
        return(
              <View style={{flex: 1}}>
                   <Spinner visible={true}/>
              </View>
            );
      }
      else{
        if(this.state.isListEmpty){
          return ( 
            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 14, fontFamily: 'worksans-regular'}}>No Notifications</Text>
            </View>
          );
        }  
        else{
          return ( 
            <View style={{flex: 1}}>
            <SwipeListView
              dataSource={this.ds.cloneWithRows(this.state.listViewData)}
              renderRow={this._renderRow.bind(this)}
              renderHiddenRow={this.renderHiddenRow.bind(this)}
             
              rightOpenValue={-150}
            />

            
            </View>
          );
        }
      }
    }

    renderImageSource(link){
      if (link === "")    
      return logo;
      else
        return {uri: link};
    }
    
    onBlockButtonPress(id,value){

        // let regUsers = this.props.user
        blockFlag = value
        let blockedUsers = Object.assign({}, this.props.user.blockedUsers);

        blockedUsers[id] = false;
        
        this.props.syncToStore({blockedUsers});
        db.blockUser(this.props.user.uid,id,value) 
    }

    viewEvent(event,eventId){
      p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
      p.then(()=> Actions.tab1({type:ActionConst.JUMP}) )
      .then(()=> Actions.mapinfo({eventId: eventId,event: event,type:ActionConst.PUSH}) )
      event['id'] = eventId;
      //Actions.tab1({type:ActionConst.REFRESH});
      //Actions.mapinfo({eventId: eventId,event: event}); 
      // db.getEventData(eventId)
      // .then((event)=> { event['id'] = eventId; Actions.tab1({type:ActionConst.JUMP,eventData:event,pressType:'notification'}); return event } )
      // .then((event) => Actions.mapinfo({eventId: eventId,event: event}) )
       }
    viewProfile(user){
      p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
      p.then(()=> Actions.tab5({type: ActionConst.REFRESH}))
       .then(()=> Actions.viewProfile({friend: user, isFriendsView: true}) )
       //db.getUserByUid(user.uid)
       //.then((user)=> { Actions.tab5({type: ActionConst.REFRESH}); Actions.viewProfile({friend: user, isFriendsView: true})} )
      
    }
    onFollowButtonPress(id,value){

        // let regUsers = this.props.user
        let regUsers = Object.assign({}, this.props.user.regUsers);

        regUsers[id] = value;
        
        this.props.syncToStore({regUsers});
        db.followUsers2(this.props.user,id,value) 
    }
    getButton(id, name){
        if(id === this.props.user.uid)
            return null;
        let followings =  Object.keys(this.props.user).includes('regUsers') ? _.get(this.props.user,'regUsers') : [] ;
        let isFollowing = followings[id]? true: false
        return(
            <ActionFFButton 
                userName={name}
                onPress={(value) => { this.onFollowButtonPress(id,value)}}
                active={isFollowing}
                ctype='follow'
            />
        )
    }

    _renderRow(rowData){
      user_image = (rowData.user.photo)? {uri: rowData.user.photo} : logo
      switch(rowData.type){
        case "invite":
        if (rowData.finished){
          return(
            <View onPress={()=> this.viewEvent(rowData.event,rowData.eventId) } style={styles.rowFront} >
              <Image style={{width:40,height:40,borderRadius:20}} source={user_image} />
              
              <Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}} >{this.formatBoldText(rowData.user.name)}ended Partyon {this.formatBoldText(rowData.event.info.name)} </Text> 
            </View>
            );   
        }
          return(
            <View>
            <TouchableOpacity onPress={()=> this.viewEvent(rowData.event,rowData.eventId) } style={styles.rowFront} >
              <Image style={{width:40,height:40,borderRadius:20}} source={user_image} />
              
              <Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}} >{this.formatBoldText(rowData.user.name)}Started Partyon {this.formatBoldText(rowData.event.info.name)}at {this.formatBoldText(rowData.event.info.location.address)}<CountDownTimer countDownComplete={()=> console.log('event ended') }  event={rowData.event} style={{textAlign: 'center',color:'black',fontSize:12}} /> Time Left  </Text>
            </TouchableOpacity>
            </View>
            );
        case "event_edit":
          return(
            <TouchableOpacity onPress={()=> this.viewEvent(rowData.event,rowData.eventId) } style={styles.rowFront} >
              <Image style={{width:40,height:40,borderRadius:20}} source={user_image} />
              <Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}} >{this.formatBoldText(rowData.user.name)} Edited Partyon {this.formatBoldText(rowData.event.info.name)} at {this.formatBoldText(rowData.event.info.location.address)} <CountDownTimer countDownComplete={()=> console.log('event ended') }  event={rowData.event} style={{textAlign: 'center',color:'black',fontSize:12}}/> Time Left  </Text>
            </TouchableOpacity>
            );
          case "edit_time":
          return(
            <TouchableOpacity onPress={()=> this.viewEvent(rowData.event,rowData.eventId) } style={styles.rowFront} >
              <Image style={{width:40,height:40,borderRadius:20}} source={user_image} />
              <Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}} >{this.formatBoldText(rowData.user.name)} Added Time To Partyon {this.formatBoldText(rowData.event.info.name)} at {this.formatBoldText(rowData.event.info.location.address)} <CountDownTimer countDownComplete={()=> console.log('event ended') }  event={rowData.event} style={{textAlign: 'center',color:'black',fontSize:12}}/> Time Left  </Text>
            </TouchableOpacity>
            );
        case "follow":
          return(
            <TouchableOpacity onPress={()=> this.viewProfile(rowData.user) } style={styles.rowFront} >
              <Image style={{width:40,height:40,borderRadius:20}} source={user_image} />
              <Text style={{flex:1,fontSize:12,marginLeft:8,fontFamily:'worksans-regular'}}  >{this.formatBoldText(rowData.user.name)}Started following you</Text>
              {this.getButton(rowData.user.uid,rowData.user.name)}
            </TouchableOpacity>
            );
        case undefined: 
         return null;
      }
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: adjacentRowHighlighted ? 4 : 1,
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
          }}
        />
      );
    }

    render(){
      
        return(
        <Container theme={theme}>
          <View style={{flex:1,justifyContent:'flex-end'}}>
            {this.renderContent1()}
          </View>
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
         showError: (msg) => dispatch(showError(msg))
    }
}

const styles = {
  container: {
		backgroundColor: 'white',
		flex: 1
	},
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'center',
    
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:16,
    paddingRight:16,
    paddingBottom:10,
    paddingTop:10,
    minHeight:60
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
	},
	controls: {
		alignItems: 'center',
		marginBottom: 30
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 5
	},
}


//export default connect(mapStateToDispatch, bindActions)(NotificationList)

var notify = connect(mapStateToDispatch, bindActions)(NotificationList)
export default SubscribeToNotification(notify);

