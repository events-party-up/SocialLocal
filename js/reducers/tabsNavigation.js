
import { tabReducer } from 'react-native-navigation-redux-helpers'

const initialState = {
    key: 'tabs',
    index: 0,
    routes: [
        {
            key: 'Maps'
        },
        {
            key: 'List'
        }
    ],
}

const inviteInitialState = {
    key: 'invite',
    index: 0,
    routes:[
        {
            key:'Invited'
        },
        {
            key:'Going'
        }
    ]
}

module.exports = 
{ tabs : tabReducer(initialState),
  party: tabReducer(inviteInitialState)
}
