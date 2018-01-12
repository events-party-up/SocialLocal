import {ADD_NOTIFICATION, REMOVE_NOTIFICATION} from '../actions/messages';
  
const initialState = {
    mainNotification: 1
}
export default function (state = initialState, action){
    switch(action.type){
        case ADD_NOTIFICATION:
            return {
                ...state,
                mainNotification : state.mainNotification + 1
            }

        case REMOVE_NOTIFICATION:
            return  {
                ...state,
                mainNotification: 0
            }

    }
}