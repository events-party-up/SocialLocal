/* This file contains database sync listers */
'use strict';
import { firebaseAuth,ref } from '../config/constants';
import {syncToStore, syncToFirebase, overwriteStoreWithUser, resetRoute, signInWithUid} from './login';

var prevUser;

// sync state to db only if user is authenticated
export const SyncDbListener = function(state, dispatch){
    
    let currUser         = _.get(state, 'login.user');
    let loginDetails     = _.get(state, 'login');
    
    if( currUser != null && 
        state.login.authenticated === true && 
        currUser.uid != null &&
        loginDetails.complete === true
        ){
        if(!_.isEqual(prevUser, currUser)){
            dispatch(syncToFirebase(currUser))
            prevUser = currUser
        }
    }
}

export const FirebaseToState = function(){
    return(dispatch, getState) => {
        // check if uid exists and logged in
        return;
        if(getState().login.authenticated && getState().login.user !== null && getState().login.user.uid !== null){
            // attach the listener
            const uid = getState().login.uid;
            
            return ref.child('users').child(uid).on('value', function(snap){
               // console.log("new user", snap.val());
               // console.log("old user", getState().login.user);
              //  console.log(" result ", _.isEqual(snap.val(), getState().login.user))
                if(_.isEqual(snap.val(), getState().login.user))
                    dispatch(overwriteStoreWithUser(snap.val()))
            })
        }
    }
}


// Need to make sure that data is synced to and fro from database
var currentUser
export const startAuthListener = function (base) {
  //this listener will update state upon changes of auth status.
    var _this=base
    return (dispatch, getState) => {   //using a redux-thunk instead of normal action
                
        _this.firebase = firebaseAuth().onAuthStateChanged(function (user) {

            if (user) {
                
                if(currentUser != user){
                    dispatch(signInWithUid(user));
                }
                currentUser = user;
          }
            else {
                // send to landing page
                    dispatch(resetRoute('landingpage'))
          }
        });
    }
}
