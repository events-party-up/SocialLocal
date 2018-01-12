/* This file contains db interaction methods for messages & groups */

/* This function creates group defined by usergroups
 * To create group, atleast two members are required or it could be a event.
 * 
 * For now, we create group between two members
 * @param data : User Data Object. It contains Friends object as {uid: true, uid: true}
 */

import * as Exception from './Exceptions';
import {ref, firebaseAuth, storage} from '../config/constants';

export function saveMessage(groupid, message){
    let messageRef = ref.child('messages').child(groupid)
     
    let key = messageRef.push().key
    
    
    return messageRef.child(key).set(message)
}

export function loadEarlierMessages(groupid,endAt){
    let messageRef = ref.child('messages').child(groupid)
                        .orderByKey().endAt(endAt)
                        .limitToLast(20)
    messages = []
    return messageRef.once('value').then((snap)=>{
        
        snap.forEach(function(child){
            let message = {
             _id: child.key,
                    text: child.val().message,
                    createdAt: new Date(child.val().created_at.timestamp),
                    user:{
                        _id: child.val().uid,
                        avatar: child.val().user.photo,
                        name: child.val().user.name
                    },
                    order: child.val().order
            }
            messages.unshift(message)
        })
    }).then(()=> {messages.shift(); return messages})
}

export function createGroup(group){
    // check data.friends if it is only 2 and throw error it has more than
    // 2 friends
    // data should Contain uid, friends
    if (_.size(data.friends) != 2){
        throw new Exception.invalidArgumentException(_.size(data));
    }
    
    let groupsRef = ref.child('groups')
    let id = groupsRef.push().key
    return groupsRef.child(id).set(group)
}

export function getGroups(events){
    
    let groupsRef = ref.child('groups')
    let promises = []
    let groups = []
    // get all the events
    events.map((groupId, i)=> {
        promises.push(groupsRef.child(groupId).once('value').then((snap) => {
                    let data = snap.val()
                    if(data == null)
                        return data;
                    data['id'] = groupId
                    
                    groups.push(data)
                    return data
                }))
    })

    return Promise.all(promises)
        .then(() => groups)
}



export function listenToMessageForGroup(gid, limit, cb){
    let messageRef = ref.child('messages').child(gid).orderByChild('created_at').limitToLast(limit)
    
    messageRef.on("child_added", cb)
}

export function removeListenToMessageForGroup(gid, cb){
    
    let messageRef = ref.child('messages').child(gid);
    return messageRef.off('child_added',cb);
}