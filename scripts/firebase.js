var firebase = require('firebase');

const config = {
  apiKey: "AIzaSyA6i8au79W4_NTiL8CN5DG0ImVJjMPs460",
  authDomain: "socialvite-f804e.firebaseapp.com",
  databaseURL: "https://socialvite-f804e.firebaseio.com",
  storageBucket: "socialvite-f804e.appspot.com",
  messagingSenderId: "473914510740"
}

firebase.initializeApp(config);

const ref = firebase.database().ref('/')
const firebaseAuth = firebase.auth
var eventsRef = ref.child('events');

var email = "puneet@gmail.com"
var password = "password"

firebaseAuth().onAuthStateChanged(function(user){
    if(user){
        performAction(user);
    }
})

firebaseAuth().signInWithEmailAndPassword(email, password)
.catch((error) => console.log(error));

function saveInvitedUsers(invited, event){
  let UserEvents = ref.child('user_events');
  
  let promises = []
  let data={}
  Object.keys(invited).forEach(function(i){
    if(invited[i] === "true"){
      // add Event information to their account
      promises.push(UserEvents.child(i).child(event).set('invited'))
    }
  })

  return new Promise(function(resolve,reject){
    Promise.all(promises)
      .then(()=> resolve({}))
      .catch((err)=> reject(err)) 
  })
  
}

function saveEventData(event, invited){
  let eventsRef = ref.child('events')
  let usersRef  = ref.child('users')
  let id = eventsRef.push().key
  

  //return usersRef.child(event.owner).child('events').child(id).set("true");
  
  return eventsRef.child(id).child('info').set(event)
      .then(() => eventsRef.child(id).child('users').child(event.owner).set('Owner'))
      .then(() => usersRef.child(event.owner).child('ownedEvents').child(id).set("true"))
      .then(() => saveInvitedUsers(invited, id))
}


function createEvent(uid){
    
    const event = {
        name: 'event_name',
        owner: uid,
        created_at : {
            timestamp: Date.now()
        }
    }
    saveEventData(event,{'E6hxvfyfEPRgidzOVPbI3dgxMIx2':'true','2jJqymqdJONs3TMKB1JH3UMQf593': 'true'});
    //return eventsRef.push({info: event});
}

function listEvents(){
    let events= []
    eventsRef.once('value')
            .then((snap) => {
                
                snap.forEach(function(snapshot){
                    //console.log('snapshot', snapshot.key)
                    var childKey = snapshot.key
                    var childData = snapshot.val()
                    //console.log('child value', childData);
                    events.push(childData)
                })

                return events
            })
            .then((events) => console.log(events))
    
    return events
}


 function getUserIdByPhone(phone){
    let answer = null;
    return ref.child('users').orderByChild('phone')
            .once('value')
            .then((snap) => {
                
                snap.forEach(function(snapshot){
                    var childData = snapshot.val()
                    
                    if(childData.phone.includes(phone))
                        answer = snapshot.val()
                })
            }).then(()=> answer)
}

function listUsers(){
    let usersRef = ref.child('users');
    return usersRef.once('value')
        .then((snap) => {
            console.log(snap.val())
        }).catch((err) => console.log(err))
}

function updateEvent(uid){
    var updates = {}
    var users = {}
    users[uid] = "true";
    const event = {
        name: 'new_event_name',
        owner: uid,
        created_at : {
            timestamp: Date.now()
        },
        users
    }
    updates['-K_LugURXXSlX1MI6QxV']=event;
    console.log(updates);
    return eventsRef.update(updates);
}   

function getInvitedEvents(uid, events){
    return ref.child('user_events').child(uid).once('value')
        .then(snap => {
            snap.forEach(function(snapshot){
                    events.push(snapshot.key)
            })
            return events
        })
}

function getEvents(uid){
    
    // ownedEvents
    let usersRef = ref.child('users').child(uid).child('ownedEvents').once('value')
        .then(snap => {
            let events = []
            snap.forEach(function(snapshot){
                events.push(snapshot.key)
            })
            return events
        }).then(events => getInvitedEvents(uid, events))
        .then(events => console.log(events))
}

function listenMessage(groupid, uid){
    let messageRef = ref.child('messages').child(groupid)
    
    messageRef.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

   
}

function createMessage(groupid, uid){
    let messageRef = ref.child('messages').child(groupid)
    
    let message ={
        created_at:{
            timestamp: Date.now()
        },
        status: 'typing',
        uid,
        message: 'hi there !'
    }
    let key = messageRef.push().key
    let messageData={}
    messageData[key] = message

    console.log(JSON.stringify(message))
    return messageRef.child(key).set(message)
}

function createGroup(uid){
    
    let groupRef  = ref.child('groups');
    let id = groupRef.push().key;

    let users = []
    let singleUser= {}
    singleUser[uid]= true;
    users.push(singleUser)


    const group = {
        name: 'new_event_name',
        owner: uid,
        created_at : {
            timestamp: Date.now()
        },
        users: singleUser
    }
    
    console.log(JSON.stringify(group))
    // push it to group
    return groupRef.child(id).set(group)
}

function performAction(user){
    console.log('user logged in ', user.email);

    // create event
    //createEvent(user.uid)
    //getEvents(user.uid)
    //listEvents()
    //listUsers();
    //updateEvent(user.uid)
    //.catch((err) => console.log(err));
    // update event
   // createGroup(user.uid)
      //createMessage('-KggaebuldechuW4rjjO', user.uid)
      listenMessage('-KggaebuldechuW4rjjO', user.uid)
    //getUserIdByPhone('9724087652')
    //    .then((user) => console.log(user))
}
