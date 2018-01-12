export const UPDATE_EVENT = "UPDATE"
import * as db from '../helpers/db';
import {Actions,ActionConst} from 'react-native-router-flux';
import {ActionSheetIOS} from 'react-native'

ownerDrawList = [

          {  icon: 'ios-clock-outline',
             text: 'Edit The Party',
             onClicked:((event)=> pushToEdit(event) )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Message',
             onClicked:((event)=> pushToMessage(event))
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Mute Notifications',
             onClicked:((event,uid)=> db.pushToMute(event.id,uid,getMuteStatus(event,uid)) )
             
             
            },
            {  icon: 'ios-clock-outline',
             text: 'End The Party',
             onClicked:((event)=> db.finishParty(event.id).then(()=> Actions.Maps({type: ActionConst.RESET}) ) )
             
            }
        ];

        invitedDrawList = [

          {  icon: 'ios-clock-outline',
             text: 'Join The Party',
             onClicked:((event,uid)=> { db.onInvitationStatusChange(event,uid,(getGoingStatus(event,uid)? 'not going' : 'going') ) } )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Message',
             onClicked:((event)=> pushToMessage(event))
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Mute Notifications',
             onClicked:((event,uid)=> db.pushToMute(event.id,uid,getMuteStatus(event,uid)) )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Remove From Feed',
             onClicked:((event,uid)=> db.removeFromFeed(event.id,uid).then(()=> Actions.Maps({type: ActionConst.RESET}) ) ) 
            }
        ];  

export function updateEvent(data, callback){
    return {
        type: UPDATE_EVENT,
        payload:{ data, callback }
    }
}

export function addTime(event, time,user){
    user_keys = _.keys(event.users);
    user_keys = _.pull(user_keys, user.uid)
    return (dispatch)=>{
        db.createEventTime(event,time).then((et) =>{ db.storeNotifications(event,user,"edit_time") })
            .then(() => db.sendMultipleNotifications(user_keys, "", user.name + " added time to "+ event.info.name));
    }
}

export function removeUser(event_id,user_id,value){
    return(dispatch)=>{
        db.removeUserfromEvent(event_id,user_id,value)
    }
}

export function endParty(event_id){
    return(dispatch)=>{
        db.finishParty(event_id).then(()=> Actions.Maps({type: ActionConst.POP_AND_REPLACE}) )
    }   
}

export function onInvitationStatusChange(event,uid,status){
    return (dispatch)=>{
        db.onInvitationStatusChange(event,uid,(status? 'going': 'not going') )
    }
}

export function showEventActionSheet(event,uid){   
  renderActionButtons = (uid === event.info.owner.uid )? ownerDrawList : invitedDrawList
  let buttons = _.map(renderActionButtons,(val) => val.text);
  if(uid !== event.info.owner.uid )
    buttons[0] =  (getGoingStatus(event,uid))? "Leave The Party": "Join The Party"
  buttons[2] = (getMuteStatus(event,uid))? "Unmute Notifications" : "Mute Notifications"
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
      renderActionButtons[buttonIndex].onClicked(event,uid)
    }
  )
}

function getMuteStatus(event,uid){
      return (event.users_muted && event.users_muted[uid] === 'muted')
}

function getGoingStatus(event,uid){
    if(event.users && event.users[uid] === 'going')
            return true;
        else
            return false;
}

function pushToEdit(event){
    Actions.editParty({event, eventId: event.id })
}

export function pushToMessage(event){
    
    p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
    p.then(()=> Actions.pop() )//Actions.Maps({type: ActionConst.POP_AND_REPLACE}) )
    p.then(()=> Actions.tab2({type:ActionConst.REFRESH}) )
    .then(()=>Actions.chat({group: event,type: ActionConst.PUSH,fromEvent:true }))
}
