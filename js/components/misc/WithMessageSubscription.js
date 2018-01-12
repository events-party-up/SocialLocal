import React, {Component} from 'React';
import * as db from '../../helpers/db';
import * as dbMessage from '../../helpers/messages';
import {InteractionManager} from 'react-native';
import { connect } from 'react-redux';

// here setstate is only for markers so we can update the view
// by calling functions in componentWillupdate
export var WithMessageSubscription = ComposedComponent => {
  class comp extends Component {
    constructor(props){
        super(props);
        this.state ={
            isReady: false,
            messages : []
        }
        
        this.mount=true;
        this.groupId = props.group.id;
        
        this._messages = []
        this.maxLimit = 20
        this.increment = 20

        this.updateMessage = _.debounce(this.updateMessage, 10)
    }

    static propTypes={
        group: React.PropTypes.object.isRequired
    }

    
    componentDidMount(){
      
      InteractionManager.runAfterInteractions(() => {
            this.mount && this.setState({isReady: false }, this.addListener())
      })
    }

    updateMessage(messages){
        this.mount && this.setState({
           messages
        })
    }

    appendMessage(message){

        message = [message]
        //let {messages} = this.state;
        this._messages = message.concat(this._messages)
        
        this.updateMessage(this._messages);
    }

    addListener(){
        const{groupId} = this
        
        this.listenerIds =  dbMessage.listenToMessageForGroup(groupId, this.maxLimit, (child)=> {
            let uid = child.val().uid
            let message = {
                    _id: child.key,
                    text: child.val().message,
                    createdAt: new Date(child.val().created_at.timestamp),
                    user:{
                        _id: uid,
                        avatar: child.val().user.avatar,
                        name : child.val().user.name
                    },
                    order: child.val().order
                }
            this.appendMessage(message)
            
        });
        
        this.eventListener = db.listenToEventChanges(this.props.group.id,(snap)=>{
            event = snap.val()
            event['id'] = this.props.group.id;
            this.mount && this.setState({group: event,messages: this.state.messages});
        })

    }

    shouldComponentUpdate(nextProps, nextState){
        if(_.isEqual(nextProps.messages, this.state.messages))
            return false;
        else
            return true;
    }

    componentWillUnmount(){
        this.mount = false;
        const {groupId} = this;
        dbMessage.removeListenToMessageForGroup(groupId, this.listenerIds);
        db.removeEventListeners(this.props.group.id,this.eventListener)
    }

    render(){
        
        return <ComposedComponent {...this.props} {...this.state}/>
    }
  }
  return connect(mapStateToDispatch, null)(comp)
}

const mapStateToDispatch = (state) =>({
    uid: state.login.uid,
})
