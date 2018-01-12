export const SHOW_ERROR = "SHOW_ERROR"
export const CLOSE_ERROR = "CLOSE_ERROR"
import {Actions, ActionConst} from 'react-native-router-flux';

export function showError(message, callback){
    return {
        type: SHOW_ERROR,
        payload:{ message, callback }
    }
}

export function closeError(){
    return{
        type:CLOSE_ERROR
    }
}