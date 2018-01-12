import React, {Component} from 'React';
import * as db from '../../helpers/db';
import {InteractionManager} from 'react-native';
import { connect } from 'react-redux';

export var SubscribeToNotification = ComposedComponent => {
  class comp extends Component {
    constructor(props){
        super(props);
        this.state ={
            isReady: false
        }
        this.mount=true;
    }

    componentDidMount(){      
      InteractionManager.runAfterInteractions(() => {
            this.mount && this.setState({isReady: false }, this.addListener())
      })
    }

    addListener(){
        const{uid} = this.props;
        this.listenerIds =  db.ListenToNotification(uid, (snap)=> {
            this.mount && this.setState({isReady: true, notifications: snap.val()})
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        if(_.isEqual(this.state.notifications, nextState.notifications))
            return false;
        return true;
    }

    componentWillUnmount(){
        this.mount = false;
        const {uid} = this.props;
        db.removeNotificationListener(uid, this.listenerIds);
    }

    render(){
        return <ComposedComponent {...this.props} {...this.state} />
    }
  }
  return connect(mapStateToDispatch, null)(comp)
}

const mapStateToDispatch = (state) =>({
    uid: state.login.uid,
})
