export const LOGIN_REQUEST = 'core_auth/LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'core_auth/LOGIN_SUCCESS'
export const LOGIN_ERROR = 'core_auth/LOGIN_ERROR'
export const LOGOUT = 'core_auth/LOGOUT'
export const RESET = 'core_auth/RESET'
export const LOGIN_ATTEMPT = 'core_auth/LOGIN_ATTEMPT'
export const LOGIN_COMPLETE = 'core_auth/LOGIN_COMPLETE'
export const SMS_AUTH_ATTEMPT = 'core_auth/SMS_AUTH_ATTEMPT'
export const SMS_VERIFIED = 'core_auth/sms_verified'
export const SMS_ERROR =  'core_auth/sms_error'
export const UPDATE_DATA = 'core_auth/update_data'
export const OVERWRITE_DATA = 'core_auth/overwrite_data'
export const UPDATE_SUCCESS_DB = 'core_func/UPDATE_SUCCESS_DB'
export const UPDATE_FAIL_DB = 'core_func/UPDATE_FAIL_DB'


import { firebaseAuth } from '../config/constants';
import GoogleSignin from '../helpers/google';
import * as db from '../helpers/db';
import * as utils from '../helpers/utils';
import { resetTo } from './sideBarNav';
import axios from 'axios';
import AUTH_SERVER from '../helpers/constants';
import {SHOW_ERROR } from './error';

import {Actions, ActionConst} from 'react-native-router-flux';
import Communications from 'react-native-communications';
import FCM, {FCMEvent} from 'react-native-fcm';
export function pushRoute(route, key){
    
    return (dispatch) => 
            Actions[route.key]({type: ActionConst.PUSH, ...route})
}

export function popRoute(data){
    return (dispatch) => 
            Actions.pop({type: ActionConst.POP_AND_REPLACE, data})
}

export function showError(error){
    return (dispatch) =>
            Actions.error(error);
}

export function resetRoute(key){
    
    return (dispatch) =>
        Actions[key]({type: ActionConst.RESET});
}

export function _signOut() {
  // try to sign out from google as well if logged in
    
    return (dispatch) => {
        Promise.resolve().
            then(() => dispatch(syncToStore({fcmToken: null})))
            .then(()=> firebaseAuth().signOut())
            .then(() => GoogleSignin.signOut())
            .then(() => dispatch(signOutUser()))
            .catch((err) => dispatch(authError(err)))
    }
}


export function getSMS(phone){
  // to do handle login authentication
    let AUTH_SERVER = 'https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/routesms';
    return (dispatch) => { 
            return axios.post(AUTH_SERVER,{'phone': phone})
                .then(()=> dispatch(loginAttempt()))
    }
}

export function sendInvitation(friends,username){
    // this function is not used
    return;
    if(friends == null)
        return;
    
    var friendsList=[]
    Object.keys(friends).forEach((v)=> { friends[v] && friendsList.push(v)})
    
    let AUTH_SERVER = "https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/invite"
    // send axios request to send Invitation
    return axios.post(AUTH_SERVER, {
            'phone': friendsList,
            'name' : username
        });
}

export function signUpUser() {
    // signup without username

    return (dispatch, getState) => {
        dispatch(loginFlowComplete());
        
        let {user} = getState().login;
        // check if he is already signed in with gmail or other means
        
        if(user.uid){
            console.log('----inside uid--',user);
            db.followUsersOnSignUp(user);
            dispatch(signInWithUid(user));
        }else{
            
            firebaseAuth().createUserWithEmailAndPassword(user.email, user.password)
            .then((firebaseUser)=> { console.log('--inside signUpUser-----',firebaseUser); user['uid'] = firebaseUser.uid; db.followUsersOnSignUp(user); })
            .catch(error => dispatch(authError(error)))
        }
    }
}

export function verifyPhoneIfUnverified(userData, dispatch){

    let promise1 = FCM.getFCMToken().then(token => {
        
        // store fcm token in your server
        if(token != null){
            userData['fcmToken'] = token
            dispatch(syncToStore(userData));
            }
        }).then(()=> {
            if(!userData.verifyPhone)
                return dispatch(pushRoute({key: 'verifyphone'}))
        }).then(()=> {
            if(userData.verifyPhone){
                dispatch(loginFlowComplete())
                
                if(userData.firstLogin === false)
                    return Actions.home({type: 'reset'})
                else
                    return Actions.instruction({type: 'reset'})
            }
        })
    return promise1;
}

// extra getState().user is needed when we need to sign up.
// because if we don't do it then it will never be able to save
// user data from store to firebase.
export function signInWithUid(user){
    // extract only email, uid and other stuff from user
    FCM.requestPermissions(); // for iOS

        let firebaseUser = utils.transformFirebaseUser(user);
        return (dispatch, getState) => db.loadUser(user.uid)
            .then((val) => _.merge(firebaseUser,val, getState().login.user))
            .then((user) => {dispatch(authUser(user)); return user})
            .then((userData) => {dispatch(syncToStore(userData)); return userData })
            .then((userData) => verifyPhoneIfUnverified(userData,dispatch))
}

export function signInUser(email, password){
    return (dispatch) =>
        firebaseAuth().signInWithEmailAndPassword(email, password)
                .then((user) => {dispatch(authUser(user)); return user})
                .then((user) => signInWithUid(user))
                .then((user)=> dispatch(loginFlowComplete()))
               // .catch(error => dispatch(authError(error)))
}

// first reset user to fix profile merging error
export function signInWithGmail(){
    return (dispatch) =>
        GoogleSignin.signIn().then((user) => {
            var credential = new firebaseAuth.GoogleAuthProvider.credential(user.idToken);
            return firebaseAuth().signInWithCredential(credential)  
        })
        .then((user) => {dispatch(resetUser()); return user})
        .then((user) => {dispatch(authUser(user)); return user})
        .then((user) => signInWithUid(user))
        .catch(error => dispatch(authError(error)))
}

export function signOutUser() {
    return (dispatch) => {
        dispatch(resetRoute('root'))
        dispatch({ type: LOGOUT });
    }
}

// load the data from firebase db if available to redux store
export function syncFromFirebase(user){
    return (dispatch) => db.loadUser(user.uid)
      .then((userData) => dispatch(syncToStore(userData)))
      .catch((error) => console.log('Interesting error !'))
  
}

// this imagines that user has already saved data in our database
export function authUser(user) {

    return {
        type: LOGIN_SUCCESS,
        payload: { user }
    }
}

export function resetUser() {
    return {
        type: RESET
    }
}

export function resetPassword(user) {
    
    return (dispatch) =>
      firebaseAuth().sendPasswordResetEmail(user.email)
}

export function authError(error) {
    return (dispatch) => {
        dispatch({ type: LOGIN_ERROR, payload: error })

        // error: after invalid username, it is taking user to landing page
        dispatch(resetRoute('landingpage'))//resetRoute('landingpage')}))
    }
}

export function smsAuthAttempt(){
    return{
        type: SMS_AUTH_ATTEMPT
    }
}

export function loginFlowComplete(){
    return {
        type: LOGIN_COMPLETE
    }
}

export function loginAttempt() {
    return {
        type: LOGIN_ATTEMPT
    }
}

export function smsVerified(){
    return {
        type: SMS_VERIFIED
    }
}

export function smsError(){
    
    return{
        type: SMS_ERROR,
    }
}

export function overwriteStoreWithUser(user){
    return {
        type: OVERWRITE_DATA,
        payload: {user}
    }
}

// Note I am removing transformFirebaseUser from syncToStore. So it stores everything in login state
export function syncToStore(user){
    // convert userData
    return {
        type : UPDATE_DATA,
        payload: {user}
    }
}



export function syncToFirebase(userData){
    return (dispatch) => {
        let user = utils.transformFirebaseUser(userData);
        
        return db.saveUser(user)
            .then(() => dispatch({type: UPDATE_SUCCESS_DB, payload: userData}))
            .catch((error) => dispatch({type: UPDATE_FAIL_DB, payload: error}))
    }
}

export function verifyCode(phone, code){
    let AUTH_SERVER = "https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/verifytoken"
    
    return (dispatch) =>
        axios.post(AUTH_SERVER, {
            'phone': phone,
            'code'  : code
        })
        .then(result => {
            if(result.data.statusCode !== 200){
                dispatch(smsError())
                throw new Error('Code did not match. Please try again !')
            }else{
                dispatch(smsVerified())
            }
        })
}
