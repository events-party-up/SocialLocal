
import {Actions, ActionConst} from 'react-native-router-flux';

export const ADD_NOTIFICATION ='core_func/ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION='core_func/REMOVE_NOTIFICATION'

export function addNotification(){
    return {
        type: ADD_NOTIFICATION
    }
}

export function removeNotification(){
    return {
        type: REMOVE_NOTIFICATION,
    }
}
