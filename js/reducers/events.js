const initialState = {}
export default function (state = initialState, action){
    switch(action.type === 'UPDATE'){
        return {
            ...state,
            action.payload.data
        }
    }
}