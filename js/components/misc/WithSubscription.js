import React, {Component} from 'React';
import * as db from '../../helpers/db';
import {InteractionManager} from 'react-native';
import { connect } from 'react-redux';

// here setstate is only for markers so we can update the view
// by calling functions in componentWillupdate

const mapStateToDispatch = (state) =>({
  uid: state.login.uid,
  user: state.login.user
})

export var WithSubscription = ComposedComponent => {
  class comp extends Component {
    constructor(props){
        super(props);
        this.state ={
            markers: undefined,
            isReady: false,
            events:[]
        }
        this.mount=true;
        
        //this.updateMarkers = _.debounce(this.updateMarkers, 600);
    }

    addListeners(events){
      
      this.listenerOwnedEventIds = db.listenToUserCreatedEvents(this.props.uid,(snap)=>{
        this.updateMarkers();
      });
      this.listenerInvitedEventsList = db.listenToUserInvitedEventList(this.props.uid,(snap)=>{
        this.updateMarkers();
      });
      //this.updateMarkers()
      if(events){
        this.listenerIds = db.listenToEventArrayChanges(events, (snap) => {
            this.updateMarkers()
        })
      }
    }

    componentDidMount(){
      
      InteractionManager.runAfterInteractions(() => {
        this.updateMarkers();
      })
    }

    componentWillReceiveProps(nextProps){
      //console.log("component will receive props", nextProps);
      if(this.props.user.blockedUsers !== nextProps.user.blockedUsers){
        this.updateMarkers();
      }
    }

    removeExistingListeners(events){
      if(events)
         db.removeEventArrayChanges(events, this.listenerIds)
      db.removeUserEventsListener(this.props.uid,this.listenerOwnedEventIds)
      db.removeListenToUserInvitedEventList(this.props.uid,this.listenerInvitedEventsList)

    }
    
    shouldComponentUpdate(nextProps, nextState){
      // we need to return true because cards in list view were not updating
      // when we join or leave the party. It should move down to proper gropus.
      if(_.isEqual(nextState.markers, this.state.markers))     
           return false;
      return true;
    }

    updateMarkers(){
      //TODO: add current latitude longitude.
      const latitude = null
      const longitude = null
      
      db.getNearbyEvents2(latitude, longitude, this.props.uid)
        .then(events => {
          
          let markers = []
          let eventsList = []
          let blockedUsers = Object.assign({}, this.props.user.blockedUsers);
          
          events.partyon.map((event, i)=> {
            if(!blockedUsers[event.info.owner.uid]){
              markers.push(event)
              eventsList.push(event.id)
            }

          })
          
          this.mount && this.setState({markers, events:eventsList, isReady:true})
        })
    }

    // remove the listener
    componentWillUnmount(){
        
        this.mount=false
        this.removeExistingListeners(this.state.events);
        
    }

    componentWillUpdate(nextProps,nextState){
        if(!_.isEqual(nextState.markers, this.state.markers)){
          
            if(this.state.events)
              this.removeExistingListeners(this.state.events);
            
            if(nextState.events)
              this.addListeners(nextState.events);
        }
    }
    
    render(){
      
        return <ComposedComponent {...this.props} {...this.state} />
    }
  }
  return connect(mapStateToDispatch, null)(comp)
}
