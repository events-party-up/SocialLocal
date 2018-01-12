import {LOGIN_SUCCESS, LOGIN_ERROR, SMS_ERROR, SMS_VERIFIED,
  SMS_AUTH_ATTEMPT, LOGOUT, UPDATE_DATA, RESET , OVERWRITE_DATA, LOGIN_COMPLETE, LOGIN_ATTEMPT} from '../actions/login';
import * as db from '../helpers/db';

const initialState = {
    authenticated: false,
    user: null,
    smsVerified: false, // TODO
    uid: null,
    complete:false
}


export default function login(state = initialState, action){

    switch(action.type){

    case LOGIN_SUCCESS:

        return{
            ...state,
            authenticated: true,
            error:null,
        }

    case LOGIN_ERROR:
        return {
            ...state,
            authenticated:false,
            error: action.payload.message,
        };

    case LOGOUT:
    case RESET:
        return initialState;

    case LOGIN_ATTEMPT:
        return {
            ...state,
            user:{
                ...state.user,
                verifyPhone: false
            }
        }

    case SMS_VERIFIED:
        return{
            ...state,
            authenticated: true,
            user:{
                ...state.user,
                verifyPhone: true
            }
        }
    case SMS_ERROR:
        return{
            ...state,
            authenticated:false,
            user:{
                ...state.user,
                verifyPhone: false
            }
        }
    case LOGIN_COMPLETE:
        return {
            ...state,
            complete:true
        }

    case OVERWRITE_DATA:
        const {authenticated, smsVerified, complete } = state;
        return {
            
            user:{
                ...action.payload.user
            },
            uid: action.payload.user.uid ? action.payload.user.uid : state.uid,
            authenticated,
            smsVerified,
            complete
        }

    case UPDATE_DATA:
        return{
            ...state,
            user:{
                ...state.user,
                ...action.payload.user  
            },
            uid: action.payload.user.uid ? action.payload.user.uid : state.uid
        }

    case SMS_AUTH_ATTEMPT:
        return{
            ...state,
        }
    default:
        return state;
    }
}
