import React, {Component} from 'React';
import * as db from '../../helpers/db';
import {InteractionManager} from 'react-native';
import { connect } from 'react-redux';

// here setstate is only for markers so we can update the view
// by calling functions in componentWillupdate
export var WithEventSubscription = ComposedComponent => {
  class comp extends Component {
    constructor(props){
        super(props);

        this.state ={
            isReady: false
        }
        
        this.mount=true;
    }

    static propTypes={
        eventId: React.PropTypes.string
    }

    componentDidMount(){
      
      InteractionManager.runAfterInteractions(() => {
            this.mount && this.setState({isReady: false }, this.addListener())
      })
    }

    addListener(){
        const{eventId} = this.props;
        
        this.listenerIds =  db.listenToEventChanges(eventId, (snap)=> {
            if (snap.val())
                this.mount && this.setState({isReady: true, event: _.merge({id: eventId}, snap.val())})
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        
        if(_.isEqual(nextState.event, this.state.event))
            return false;
        return true;
    }

    componentWillUnmount(){
        this.mount = false;
        const {eventId} = this.props;
        db.removeEventListeners(eventId, this.listenerIds);
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
