import {ref, firebaseAuth, storage} from '../config/constants';
import * as utils from './utils';
import base64 from 'base-64'
import RNFetchBlob from 'react-native-fetch-blob'
import * as constants from './constants'
const uuidV1 = require('uuid/v1')
const logo  = require('../../images/social-logo.png');
const test_url = "https://firebasestorage.googleapis.com/v0/b/socialvite-f804e.appspot.com/o/images%2F54370900-04c9-11e7-8565-115653711ed9?alt=media&token=4081e6e3-52ad-4397-bf9d-2c7dff266fe6";
const testToken = ["cBaTbmYqvqg:APA91bETSl0RTSIeBcpAaZmjgvSjM5oslmmSnKolhM7_K6ajBrqbByNvwkr_4e0FZr7rWbLlAObf3Gk1hDo8iRLOZIp44Cm5njspWmG9RrTc0JaVuTvMssnB1cCuUDXU1Mx_9C08Uy2g"];


const fs = RNFetchBlob.fs
const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const defaultCustomUser = {
  'name' : '',
  'phone': '+11111',
  'about': '',
  'city' : '',
  'hasLoggedInWithPassword': false,
  'verifyPhone': false,
  'isAdmin': false,
  'created_at' : {
    'timestamp': 11111
  },
  'username': ''
}

function convertToBase64(data){
  //return data
  return base64.encode(data);
}

export function getUserIdByEmail( email ) {
    return ref.child('users').orderByChild('email')
            .startAt(email)
            .endAt(email)
            .once('value')
            .then((snap) => snap.val())
}

function getUserIdByPhone(phone){
    let answer = null;
    phone = phone.replace(/\D/g,'');
    phone = "+1"+phone.slice(-10);
    
    
    //return Promise.resolve(null)
    return ref.child('phones').child(phone).once('value')
            .then((snap)=> snap.val())
    
}


function updateData(user){
  // add created_at
  // extract followers from user
  if(user.created_at == null)
    user.created_at={timestamp: Date.now()}
  var mergedData = {}
  mergedData['users/'+user.uid] = user;
  
  if(user.username != null && user.username != '')
    mergedData['usernames/'+user.username]={uid: user.uid};
    
  mergedData['emails/'+ convertToBase64(user.email)]={uid:user.uid}
  mergedData['phones/'+ user.phone]={uid:user.uid}

  // followers
  if(user.regUsers){
    Object.keys(user.regUsers).forEach(function(uid){
    // check if it was true
      if(user.regUsers[uid])
        mergedData['user_followers/'+uid+'/'+user.uid]=true
    })
  }
  
  //console.log("update data", JSON.stringify(mergedData));
  return ref.update(mergedData)
  
}

export function checkUserName(username){
  if(!username)
    return new Promise.reject({message: 'Please enter a valid username. It should only contain letters and numbers'});
  return new Promise( (resolve, reject) => 
      ref.child('usernames').child(username).once('value')
          .then((snap) => {
            if(snap.exists()) 
              reject(new Error('Username is not available'))
            else
              resolve();
        }) 
  )
}

export function checkEmail(email){
  let encodedData = convertToBase64(email)
  if(email === ""){
    return new Promise.resolve({})
  }
  return new Promise(function(resolve, reject){
    ref.child('emails').child(encodedData).once('value')
      .then((snap) => {
        
        if(snap.exists())
          reject(new Error("Email address is already in use by another account"))
        else
          resolve({})
      })
  })
}

export function loadUser(uid){
  
  let retValue = {
    ...defaultCustomUser,
    uid
  }
  return ref.child('users').child(uid).once('value')
    .then((snap) => {
      if(snap.exists())
        return snap.val();
      else
        return retValue;
    })
}

export function getUserImage(uid){
   return ref.child('users').child(uid).child('photo').once('value').then((snap)=> {
    if(snap.exists()){
     return snap.val()
    }
    else{
     return test_url 
    }
  }).catch((e)=> console.log('exception',e) );
}

let followUsers=[]
function listUser(uid,location){
  
  return ref.child('users').child(uid).once('value')
    .then((snap) => {
      if(snap.exists() && snap.val().latLong && longLatDistance(snap.val().latLong,location) )
        followUsers.push(snap.val())
    })
}

function longLatDistance(latLong1,latLong2) {
    lat1 = latLong1.latitude;
    lat2 = latLong2.latitude;
    lon1 = latLong1.longitude;
    lon2 = latLong2.longitude;
    var R = 3981.875; //6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(1) <= 50;
}

// This should throw error if trying to save as unauthenticated user

// this function is used during signup when user did not exist.
// if he had existed.. firebase would have thrown error.
// here we just need to store NEW data in database.

export function saveUser(userData){
  return updateData(userData)
  
}

export function getUsersData(users){
  let promises = []
  let usersData = []
  _.map(users, function(status,uid){
      
      
      promises.push(
        ref.child('users').child(uid).once('value')
                .then(snap => {
                  let data = snap.val()
                  let contact = {
                    givenName : data.name,
                    familyName: '',
                    thumbnail : data.photo,
                    uid       : data.uid,
                    status    : status
                  }
                  
                  usersData.push(contact)
            })
      )
  })

  return Promise.all(promises)
    .then(() => usersData)
}

export function getFollowers(uid,location){
  // search in the followers list.
  let userFollowersRef = ref.child('user_followers');
  let promises = []
  followUsers.splice(0, followUsers.length);
  
  return getBlockedBy(uid).then(blockedByList =>
  userFollowersRef.child(uid).once('value')
    .then((snap) => {
        snap.forEach(function(snapshot){
          if(snapshot.val()){
            if(blockedByList){
              if(snapshot.val() && !blockedByList[snapshot.key])
                promises.push(listUser(snapshot.key,location))
            }else{
              if(snapshot.val())
                promises.push(listUser(snapshot.key,location))
            }
          }
        })
    }).then(()=>Promise.all(promises))
    .then(()=> followUsers))
}


export function getUsers(eid){
  let eventsRef = ref.child('events')
  let usersRef = ref.child('users')
  let users = []
  
  return eventsRef.child(eid).child('users').once('value')
        .then((snap) => {        
            snap.forEach(function(snapshot){
              let data = {uid: snapshot.key, status: snapshot.val()}
              users.push(data)
            })
            return users
        })
        //.then(() => users)
        .then((users) => getUsersData(users))
        .then((users) => {
          let invited = []
          let going = []
          _.forEach(users, function(user){
             const {name, photo, status} = user;
                let data = {
                    givenName: name,
                    thumbnail: photo
                }
                if(status === constants.STATUS_INVITED)
                    invited.push(data)
                if(status === constants.STATUS_GOING)
                    going.push(data)
          })
          return {invited, going}
        })
}

export function listenToUser(user_id,cb){
   let userRef = ref.child('user_followers').child(user_id);
   return userRef.on('value',cb);
}
  
export function removeUserListener(user_id,cb){
 let userRef = ref.child('user_followers').child(user_id);

 return userRef.off('value',cb);
}

export function listenToUserBlocked(user_id,cb){
 let userRef = ref.child('user_blocked').child(user_id);

 return userRef.on('value',cb);
}
  
export function removeUserBlockedListener(user_id,cb){
 let userRef = ref.child('user_blocked').child(user_id);

 return userRef.off('value',cb);
}  


export function listenToUserCreatedEvents(uid,cb){
  let eventsRef = ref.child('users').child(uid).child('ownedEvents');

  return eventsRef.on('value',cb);
}



export function removeUserEventsListener(uid,cb){
  let eventsRef = ref.child('users').child(uid).child('ownedEvents');

  return eventsRef.off('value',cb); 
}

export function listenToEventArrayChanges(event_ids,cb){
  let listeners=[];

  event_ids.forEach((event_id)=>{
    listeners.push(this.listenToEventChanges(event_id,cb))
  })
  return listeners
}
export function removeEventArrayChanges(events,cb){
  // let listeners=[];
  // events.forEach((event_id)=>{
  //   listeners.push(this.removeEventListeners(event_id,cb))
  // })
  // return listeners
}

export function ListenToNotification(uid,cb){
    return ref.child('notifications').child(uid).on('value',cb);
}

export function removeNotificationListener(uid,cb){
  return ref.child('notifications').child(uid).off('value',cb);
}

export function getNotifications(uid){
  return ref.child('notifications').child(uid).once('value').then((snap)=> {return snap.val()} )
}
export function setNotifications(uid,data){
  return ref.child('notifications').child(uid).set(data)
}

export function sendNotification(fcmToken,title,message,type,dataId){
    var s = 'https://fcm.googleapis.com/fcm/send';
    return fetch(s, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'key=AAAA4FrVHD0:APA91bHZPiJZpG2ZdKrdbq9vJvGRo6VnQn0Jwm7i9SJuiCulvefC2j-0zVnAsXHk50-VJ1tY6aNf391lvt3Ml8Mc1EMrStBrdy3RgsBgszsh7P_85kHGq_Y9A-_vV5xTi8e2sdiwZ-UK'
      },
      body: JSON.stringify({
        "registration_ids":fcmToken,
        "notification" : {
           "body" : message,
           "title": title,
           "sound": "default",
           "key": "hello1",
         },
        "data" : {notificationType: type,notificationDataId:dataId},
      })
    })
    .then((response) =>{console.log('Message sucess',response)} )
    .catch((e) =>{console.log('Message failed',e)} );
}

export function delete_notification(user_id, key){
  let notifications = ref.child('notifications').child(user_id);
  notifications.child(key).remove();
}

export function storeNotifications(event,user,notificationType){
  let notificationsRef = ref.child('notifications');
  let id = event.id;
  user_keys = _.keys(event.users);
  user_keys = _.pull(user_keys,user.uid)
  _.forEach(user_keys,function(v){
    if(v){
      // add notifications
        notification_key = notificationsRef.child(v).push().key;
        userData = (user.photo) ? {name: user.name, uid: user.uid,photo: user.photo} :{name: user.name, uid: user.uid}
        finishingTime = {timestamp: event.info.finished_at.timestamp }
        eventData = {finished_at: finishingTime,name:event.info.name,address: event.info.location.address}
        notificationData={type:notificationType,data:{user: userData,event: eventData,eventId: id },timestamp: new Date().getTime()}
        notificationsRef.child(v).child(notification_key).set(notificationData)  
    }
  });
}

export function followUsers2(user,follow_uid,value){
  user_uid=user.uid
  ref.child('user_followers').child(follow_uid).child(user_uid).set(value);
  if(value){
    userData = (user.photo) ? {name: user.name, uid: user.uid,photo: user.photo} :{name: user.name, uid: user.uid}
    followData={type:'follow',data:{user: userData},timestamp: new Date().getTime()}
    return ref.child('notifications').child(follow_uid).child(user.uid).set(followData)
    .then(()=> sendMultipleNotifications([follow_uid], "", user.name +" started following you",'follow',user_uid ));
  }
}

export function followUsersOnSignUp(user){
  let promises = []
  _.each(user.regUsers, function(value,regUserId){
    promises.push(followUsers2(user,regUserId,value))
  })
  return Promise.all(promises);
}

export function getFollowerFollowingCountOf(uid){
  let usersRef = ref.child('users');
  let userFollowersRef = ref.child('user_followers');
  let followers = [];
  let following = [];


  return getBlockedBy(uid).then((blockedByList) => {
    let promise1 = usersRef.child(uid).child('regUsers').once('value')

      .then((snap)=> {
        let prs = [];
        if (snap.val() !== null){
          
          snap.forEach(function(snapshot){
            if (blockedByList){ 
              if(snapshot.val() && !blockedByList[snapshot.key])
                prs.push(getUserByUid(snapshot.key))
            }
            else
            {
             if(snapshot.val())
                prs.push(getUserByUid(snapshot.key)) 
            }
          })
        }

        return Promise.all(prs);
      });

    let promise2 = userFollowersRef.child(uid).once('value')
      .then((snap) => {
        let prs = [];
        if (snap.val() !== null ){
          snap.forEach(function(snapshot){
            if(blockedByList){
              if(snapshot.val() && !blockedByList[snapshot.key])
                prs.push(getUserByUid(snapshot.key))
            }
            else{
              if(snapshot.val())
                prs.push(getUserByUid(snapshot.key)) 
            }
          })
        }
        return Promise.all(prs);
      });


    return Promise.all([promise2, promise1])
          .then(([followers, following]) => ({followers, following }));
  })

}


export function getUserByUid(uid){
    return ref.child('users').child(uid).once('value')
      .then((snap) => snap.val())
      .catch((e)=> console.log('exception',e));
}

export function getAllUsers(){
  userValues = [];
  return new Promise(function(resolve, reject){
    ref.child('users').once('value')
      .then((snap) => {
        user_data = []
        if(snap.exists()){
          snap.forEach( (m) => { user_data.push(m.val()) } );
          resolve({suggestions: user_data})
        }
        else
          reject(new Error("No data found"));
          
      })
  })
}

export function getBlockUserList(user){
  return getBlockedBy(user.uid)
          .then((blockedByList) => {
            blockedByUsers = _.pickBy(blockedByList, function(value, key) {
             return value;
            });
            userBlocked=_.pickBy(user.blockedUsers, function(value, key) {
              return value;
            });
          let blockedList = _.merge(blockedByUsers, userBlocked);
          return blockedList
    })
}

export function getAllUserIds(){
 return ref.child('users').once('value')
      .then((snap) => snap.val()); 
}

const uploadImage = (uri, mime = 'image/jpeg') => {
  
  return new Promise((resolve, reject) => {
    const uploadUri = uri.uri.replace('file://', '')
      const sessionId = new Date().getTime()
      let uploadBlob = null
      const imageRef = storage.child('images').child(uuidV1())
      
      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function uploadPhoto(user, photo){

  return uploadImage(photo.uri)
}

export function uploadPhoto2(photo){
  return uploadImage(photo.uri)
}

export function uploadPhoto3(photo){
  return uploadImage(photo.uri)
}
/*
 * Updates /events/info
 *         /events/users/userid -> owner
 *         /events/eventid/users/userid -> true
 *         /user_events/inviteUserId/eventid -> true
*/

//filter signed up and unsigned users
export function filterCollection(collection){

  let usersRef = ref.child('users');
  collections.splice(0, collections.length);
  registered.splice(0, registered.length);
  notregistered.splice(0, notregistered.length);
  // check by email
  let promises = []
  collection.map((contact, i) => {
    const number = _.get(contact,'phoneNumbers[0].number')
    if(number){
      promises.push(getUser(contact, number));
    }
  });
  return Promise.all(promises)
  .then(()=> ({registered, notregistered}))
}

//blocking a user
export function blockUser(user_uid,blocked_uid,value){
  if(value){
    let userInvitedNew=[]
    ref.child('users').child(user_uid).child('ownedEvents').once('value').then((snap)=>{
      user_owened_events = snap.val();
      ref.child('user_events').child(blocked_uid).once('value').then((snap_events)=>{
        snapEventVal=snap_events.val();
        event_keys=Object.keys(snapEventVal);
        for (var property in user_owened_events) {
          if(event_keys.includes(property)){
            ref.child('user_events').child(blocked_uid).child(property).remove();
            ref.child('events').child(property).child('users').child(blocked_uid).remove();
          }
        }
      });
    });

    ref.child('users').child(blocked_uid).child('ownedEvents').once('value').then((snap)=>{
      blocked_owened_events = snap.val();
      ref.child('user_events').child(user_uid).once('value').then((snap_events)=>{
        snapEventVal=snap_events.val();
        event_keys=Object.keys(snapEventVal);
        for (var property in blocked_owened_events) {
          if(event_keys.includes(property)){
            ref.child('user_events').child(user_uid).child(property).remove();
            ref.child('events').child(property).child('users').child(user_uid).remove();
          }
        }
      });
    });

  }
  ref.child('user_blocked').child(blocked_uid).child(user_uid).set(value);
}
  
export function removeFromFeed(event_id,uid){ 
  ref.child('users').child(uid).child('ownedEvents').child(event_id).remove()
    ref.child('events').child(event_id).child('users').child(uid).remove()
  return ref.child('user_events').child(uid).child(event_id).remove();
}

export function pushToMute(event_id,uid,status){
   if(status){
    ref.child('events').child(event_id).child('users_muted').child(uid).remove();  
   }
   else{
    ref.child('events').child(event_id).child('users_muted').child(uid).set('muted');
   }
}
//get user  user_blocked list
export function getBlockedBy(uid){
  return ref.child('user_blocked').child(uid).once('value').then((snap)=> snap.val() );
}

export function addUserToFollowing(user){
  let mergedData = {}
  let firstSignUp = _.get(user, 'firstSignUp')
  if(firstSignUp == true){
     Object.keys(user.regUsers).forEach(function(uid){
    // check if it was true
      if(user.regUsers[uid])
        mergedData['user_followers/'+uid+'/'+user.uid]=true
    })
  }
  mergedData['users/'+user.uid+'/firstSignUp'] = false
  ref.update(mergedData)
}

// event db functions start here

export function updateEventData(event, invited, user){
  
  let eventsRef = ref.child('events')
  let usersRef  = ref.child('users')

  let id = event.id

  user_keys = _.keys(invited);
  user_keys = _.pull(user_keys,user.uid)

  
  return eventsRef.child(id).child('info').set(event.info)
      .then(() => eventsRef.child(id).child('users').child(user.uid).set('Owner'))
      .then(() => usersRef.child(user.uid).child('ownedEvents').child(id).set("true"))
      .then(() => saveSMSInvitationForEvent(event))
      .then(() => saveInvitedUsers(invited, id,event.info,user, event.users))
      //.then((keys)=> sendMultipleNotifications(keys,"",user.name +" started partyon "+ event.info.name,'event',id) )
      .then(() =>{return id}).catch((e)=>console.log('error is made',e))

}

export function saveEventData(event, invited,user, inviteUsers){
  
  console.log("save evnent data ", event)
  let eventsRef = ref.child('events')
  let usersRef  = ref.child('users')
  let id = eventsRef.push().key

  user_keys = _.keys(invited);
  user_keys = _.pull(user_keys,user.uid)
  return eventsRef.child(id).child('info').set(event)
      .then(() => eventsRef.child(id).child('users').child(event.owner.uid).set('Owner'))
      .then(() => usersRef.child(event.owner.uid).child('ownedEvents').child(id).set("true"))
      .then(() => saveSMSInvitationForEvent({inviteUsers,id}))
      .then(() => saveInvitedUsers(invited, id,event,user))
      .then(()=> sendMultipleNotifications(user_keys,"",user.name +" started partyon "+ event.name,'event',id) )
      .then(() =>{return id}).catch((e)=>console.log('error is made',e))
}

export function sendMultipleNotifications(user_keys,title,message,type,dataId){
  let fcmTokens=[];
  let tokenPromises=[];
  _.forEach(user_keys,function(v){
    tokenPromises.push(getFirebaseToken(v).then((fcmToken) => { fcmTokens.push(fcmToken); return fcmToken; }));
  });

  return Promise.all(tokenPromises)
  .then((returnedTokens)=> { sendNotification(returnedTokens,title,message,type,dataId);} )
  .catch((err)=> console.log('error1',err)); 
}

export function editEventData(event,user){
  let notificationsRef = ref.child('notifications');
  let eventsRef = ref.child('events');
  let id = event.id;
  user_keys = _.keys(event.users);
  user_keys = _.pull(user_keys,user.uid);
  storeNotifications(event,user,"event_edit");
  sendMultipleNotifications(user_keys,"",user.name +" edited partyon "+ event.info.name,'event',id);
  return eventsRef.child(id).child('info').set(event.info);
}

export function getEventData(eventId){
    let eventsRef = ref.child('events');
    return eventsRef.child(eventId).once('value').then((snap)=> {
     if(snap.exists){
      return snap.val();
      } 
      else{
        return null
      }
    } );   
}

export function getNearbyEvents2(lat, long, uid){
  let eventsRef = ref.child('events')
  let promises = []
  let events ={ 
    partyon:[],
    events:[]
  }
  
  return getEvents(uid)
          .then(({OwnedEvents, InvitedEvents}) => {
            _.forEach(OwnedEvents, function(eventid){
                promises.push(
                  eventsRef.child(eventid).once('value').then((snap) => {
                    let data = snap.val()
                    data['id'] = eventid;
                    // check if it is expired or not
                    if(data.info.finished_at && data.info.finished_at.timestamp > Date.now())
                      events.partyon.push(data)
                    //else
                    //  deleteEvent(eventid)
                    return data
                }))
            })

            _.forEach(InvitedEvents, function(val){
                promises.push(
                  eventsRef.child(val).once('value').then((snap) => {
                    let data = snap.val()
                    data['id'] = val;
                    // check if it is expired or not
                    if(data.info.finished_at && data.info.finished_at.timestamp >= Date.now())
                      events.partyon.push(data);
                    return data
                }))
            })

            return Promise.all(promises)
              .then(() => events)
        })
}

export function getNearbyEvents(lat, long, uid){
  let eventsRef = ref.child('events')
  let events= []

  return eventsRef.once('value')
    .then((snap) => {
    snap.forEach(function(snapshot){
                    //console.log('snapshot', snapshot.key)
      var childKey = snapshot.key
      var childData = snapshot.val()
                    //console.log('child value', childData);
      childData['id'] = childKey;
      events.push(childData)
    })
    return events
  })
}
var collections = []
var registered = []
var notregistered = []
function getUser(contact, number){
  
    return getUserIdByPhone(number)
      .then(user => {
          //console.log("user ", user)
          if(user){
            //contact.uid = user.uid;
            contact.uid = user.uid;
            
            //collections.push(contact)
            registered.push(contact)
          }else{
            
            notregistered.push(contact) 
          }
        })
}

export function getFirebaseToken(uid){
  return ref.child('users').child(uid).child('fcmToken').once('value').then((snap)=> {return snap.val();} )
}

export function saveSMSInvitationForEvent(event){
  
  let mergedData = {}

  Object.keys(event.inviteUsers).forEach(function(i){
      mergedData["events/"+event.id+"/inviteUsers/"+i]=event.inviteUsers[i]
  })

  return ref.update(mergedData)
}

export function saveInvitedUsers(invited, eventId,event,user, event_users){
  let UserEvents = ref.child('user_events');
  let eventsRef = ref.child('events');
  let notificationsRef = ref.child('notifications');
  let promises = []
  
  let user_keys = []
  Object.keys(invited).forEach(function(i){
    if(invited[i] === true ){
      
      if(event_users && ( event_users[i] === "invited" || event_users[i] === "going"))
        return
      user_keys.push(i)
      // add notifications
      id = notificationsRef.child(i).push().key
        userData = (user.photo) ? {name: user.name, uid: user.uid,photo: user.photo} :{name: user.name, uid: user.uid}
        finishingTime = {timestamp: event.finished_at.timestamp }
        eventData = {finished_at: finishingTime,name:event.name,address: event.location.address}
        notificationData={type:'invite',data:{user: userData,event: eventData,eventId: eventId} ,timestamp: new Date().getTime()}
        notificationsRef.child(i).child(id).set(notificationData);
      // notificationsRef.child(i).once('value').then((snap)=>{
      //   let data = (snap.val())? snap.val() : [];
      //   userData = {name: user.name, uid: user.uid,photo: user.photo}
      //   finishingTime = {timestamp: event.finished_at.timestamp }
      //   eventData = {finished_at: finishingTime,name:event.name,address: event.location.address}
      //   notificationData={type:'invite',data:{user: userData,event: eventData,eventId: eventId}}
      //   data.push(notificationData);
      //   notificationsRef.child(i).set(data);
      // });
      // add Event information to their account
      promises.push(UserEvents.child(i).child(eventId).set('invited'))
      promises.push(eventsRef.child(eventId).child('users').child(i).set('invited'))
    }else{
      
      promises.push(UserEvents.child(i).child(eventId).remove())
      promises.push(eventsRef.child(eventId).child('users').child(i).remove())
    }
  })
  

  return new Promise(function(resolve,reject){
    Promise.all(promises)
      .then(()=> resolve(user_keys))
      .catch((err)=> reject(err)) 
  })
}

function getInvitedEvents(uid, events){
    
    let OwnedEvents=events;
    
    let InvitedEvents=[]
    return ref.child('user_events').child(uid).once('value')
        .then(snap => {
            snap.forEach(function(snapshot){
                  if (snapshot.val() === 'invited' )
                  InvitedEvents.push(snapshot.key)
            })
            return {OwnedEvents, InvitedEvents}
        })
}

export function getEvents(uid){
    
    // ownedEvents
    
    return ref.child('users').child(uid).child('ownedEvents').once('value')
        .then(snap => {
            let events = []
            snap.forEach(function(snapshot){
                events.push(snapshot.key)
            })
            return events
        }).then(events => getInvitedEvents(uid, events))
}

export function listenToUserInvitedEventList(uid,cb){
  return ref.child('user_events').child(uid).on('value',cb);
}

export function removeListenToUserInvitedEventList(uid,cb){

  return ref.child('user_events').child(uid).off('value',cb);
}

export function listenToEventChanges(eid, cb){
  let eventsRef = ref.child('events')
  return eventsRef.child(eid).on('value', cb)
}

export function removeEventListeners(eid, cb){
  let eventsRef = ref.child('events')
  return eventsRef.child(eid).off('value', cb)
}


function addHours(hour){
      date = new Date()
      date.setHours(date.getHours()+ hour)
      return date.getTime();
  }

  export function removeUserfromEvent(event_id,user_id,value) {
    let eventsRef = ref.child('events');
    let invitedRef = ref.child('user_events').child(user_id).child(event_id)
    invitedRef.set('removed')
    return eventsRef.child(event_id).child('users').child(user_id).set(value)
  }

export function createEventTime(event,time){
  let eventsRef = ref.child('events');
  let finishingTime=event.info.finished_at.timestamp;
  current_end_time = new Date(finishingTime)
  current_end_time.setHours(current_end_time.getHours()+time)
  return eventsRef.child(event.id).child('info/finished_at/timestamp').set(current_end_time/1)
}

export function finishParty(event_id){
  let eventsRef = ref.child('events');
  current_date = new Date();
  current_time = current_date.getTime()
  return eventsRef.child(event_id).child('info/finished_at/timestamp').set(current_time)
}

export function addEventTime(event, time){
  let eventsRef = ref.child('events');
  let newtime = addHours(time);
  return eventsRef.child(event.id).child('info/finished_at/timestamp').set(newtime)
}

export function onInvitationStatusChange(event, uid,status){
  console.log("event ", event.id, "status", status);
  let eventsRef = ref.child('events')
  return eventsRef.child(event.id).child('users').child(uid).set(status);
}

export function deleteEvent(eventId){
  let eventsRef = ref.child('events');
  let UserRef = ref.child('users')
  let InvitedEventsRef = ref.child('user_events');
  eventsRef.child(eventId).child('users').once('value').then((snap) => {
    snap.forEach(function(kv){ 
      if(kv.val() == "Owner" ){
        UserRef.child(kv.key).child('ownedEvents').child(eventId).remove();
      }
      else{
        InvitedEventsRef.child(kv.key).child(eventId).remove();
      }
    })
  }).then(() => eventsRef.child(eventId).remove() )

}

