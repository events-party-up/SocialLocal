import React, {Component} from 'react';

import MapEventInfoFull from '../inputs/MapEventInfoFull';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {pushRoute, popRoute, resetRoute, showError} from '../../actions/login';
import WithEventSubscription from '../misc/WithEventSubscription';
import {addTime, onInvitationStatusChange,endParty} from '../../actions/events';

/* Configuration */

const mapStateToDispatch = (state) =>({
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         reset: (route) => dispatch(resetRoute(route)),
         showError:(msg, cb) => dispatch(showError(msg, cb)),
         addTime:(event,time,user)=>dispatch(addTime(event,time,user)),
         onInvitationStatusChange:(event,uid,status)=> dispatch(onInvitationStatusChange(event,uid,status)),
         endParty:(event_id)=> dispatch(endParty(event_id)),
    }
}

export default connect(mapStateToDispatch, bindActions)(MapEventInfoFull)
//export default WithEventSubscription(map_comp);