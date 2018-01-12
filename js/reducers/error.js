import { SHOW_ERROR, CLOSE_ERROR } from '../actions/error';

const initialState ={
    errorState: CLOSE_ERROR,
    errorMessage: 'Custom error message is here.'
}

export default function(state = initialState, action){
    if(action.type === CLOSE_ERROR){
        return{
            ...state,
            errorState: CLOSE_ERROR,
            errorMessage: '',
            callback:null
        }
    }

    if(action.type === SHOW_ERROR){
        return{
            ...state,
            errorState: SHOW_ERROR,
            errorMessage: action.payload.message,
            callback: action.payload.callback
        }
    }

    return state;
}