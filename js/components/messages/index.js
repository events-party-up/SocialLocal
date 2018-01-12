import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    InteractionManager
} from 'react-native';

/** Opensource Modules **/
import {GiftedChat, Message, utils} from 'react-native-gifted-chat';
import {Actions, ActionConst, DefaultRenderer} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Icon } from 'native-base';

/** Custom modules **/
import * as db from '../../helpers/db';
import baseStyle from '../../themes/base-styles';
import * as dbMessage from '../../helpers/messages';
import {WithMessageSubscription} from '../misc/WithMessageSubscription';

class Chat extends Component{

    static PropTypes ={
        group: React.PropTypes.object.isRequired
        //groupId : React.PropTypes.number.isRequired
    }

    constructor(props){

        // refresh the title 

        super(props);
        
        this.state = {
            loadEarlier:false,
            typingText: null,
            isLoadingEarlier: false,
            messages: []
         }

        this.groupId = this.props.group.id
        this.mount = true

        // store UserHashmap
        this.userMaps = {}
        this.messageMaps ={}
        this.updateMessages = _.debounce(this.updateMessages, 100)
    }


    componentWillMount(){
        const{name} = this.props.group.info
        Actions.refresh({ title: name,renderRightButton: (()=>this.renderRightNavbarIcon())})
    }

    renderRightNavbarIcon(){
        event = this.props.group;
        return(
          <View>
            <Icon
              name='ios-more'
              onPress={()=>this.viewEvent(event)}
              style={{color: 'white',alignSelf: 'center'}}
            >
            </Icon>
          </View>
        );  

    }
    viewEvent(event){
      
      p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
        p.then(()=> Actions.message({type:ActionConst.POP_AND_REPLACE}) )
        .then(()=>Actions.mapinfo({eventId: event.id,event: event,type: ActionConst.PUSH}) )
    } 

    onLoadEarlier(){
        this.setState({isLoadingEarlier: true})
        
        let len = this.state.messages.length
        let lastId = this.state.messages[len-1]._id
        dbMessage.loadEarlierMessages(this.groupId, lastId).then((messages) =>{
            
            if(messages.length == 0){
                this.setState({
                    loadEarlier: false,
                    isLoadingEarlier: false
                })
            }else{
                this.setState({
                    messages: GiftedChat.prepend(this.state.messages, messages),
                    isLoadingEarlier: false
                })
            }
            
        })
    }

    getUserList(event,uid,message,title){
        
        
        let user_keys = _.pickBy(event.users, function(value, key){if(value == 'going' || value == 'Owner' || value == 'invited') return key;})
        user_keys = _.keys(user_keys)
        let muted_user_keys = _.keys(event.users_muted);
        
        user_keys = _.pull(user_keys,this.props.uid)
        user_keys = _.difference(user_keys, muted_user_keys)
        
        if(!_.isEmpty(user_keys)){
            db.sendMultipleNotifications(user_keys,title,message,'message',event.id);
        }
        
    }

    // function to get more information on messages
    updateMessages(){
        
        let {messages} = this.state;
        if(messages == null)
            return;
        
        
        let promises = []
        let _this = this
        _.forEach(messages, function(message, i ){
            // check if message has already been fetched
            if(_this.messageMaps[message._id] != null){
                return
            }
            
            promises.push(_this.getUser(message.user._id)
                            .then((user) => {
                                
                                message.user.name = user.name
                                message.user.avatar = user.photo

                                messages[i] = message;
                                // store in hashmap
                                _this.messageMaps[message._id] = message
                            })
                    )
         })
        Promise.all(promises)
            .then(() => this.setState({messages, isReady:true}))
    }

    shouldComponentUpdate(nextProps, nextState){
        
        if(_.isEqual(nextState.messages, this.state.messages))
            return false;
        else
            return true;
    }

    /*
     * Here is the architecture to update the messages
     * All messages as read are first put into the state variable.
     * hence there is no delay in showing the message.
     * 
     * After updating the state & view, a debounced method is called on all messages
     * to check if there is need to pull further information like photo and image
     * from the db.
     */
    componentWillReceiveProps(nextProps){
        
      let {messages} = nextProps;
      if(messages.length == 0 ){
          return;
      }
      
      this.setState({messages, loadEarlier: true})

     //  InteractionManager.runAfterInteractions(() => {
     //       this.mount && this.updateMessages()
     // })
    }

    getUser(uid){
        // check if uid is present in userMaps
        
        if(this.userMaps[uid] != null)
            return new Promise.resolve(this.userMaps[uid])
        else{
            return db.loadUser(uid)
                .then((user) => {
                    
                    this.userMaps[uid] = user
                    return user
                })
        }
    }


    componentWillUnmount(){
      this.mount = false;
    }

    onSend(messages = []){
        const {group, uid, user} = this.props;
        let timestamp = Date.now()
        messages.forEach(message => {
            
            let messageData ={
                created_at:{
                    timestamp
                },
                status: 'completed',
                uid,
                message: message.text,
                order: -1*timestamp,
                user:{
                    name: user.name,
                    avatar: (user.photo)? user.photo : ''
                }
            }
            
            dbMessage.saveMessage(this.groupId, messageData)
            partyMessage = user.name + " : " + messageData.message;
            partyName = group.info.name;
            this.getUserList(this.props.group,this.props.uid,partyMessage,partyName);
        })
    }
    renderCustomView(uid,message){
        
        const{user} = message.currentMessage;
        //console.log( message.currentMessage.text + " EQUAL ", _.isEqual(user._id, uid))
        if(_.isEqual(user._id, uid)){
            return <Text style={styles.uidtext}>{user.name}</Text>
        }else{
            return <Text style={styles.othertext}>{user.name}</Text>
        }
        
    }

    render(){
        
        return(
            <GiftedChat
                loadEarlier = {this.state.loadEarlier}
                onLoadEarlier = {this.onLoadEarlier.bind(this)}
                isLoadingEarlier = {this.state.isLoadingEarlier}
                isAnimated = {true}
                messages = {this.state.messages}
                onSend = {this.onSend.bind(this)}
                user ={{
                    _id: this.props.uid,
                }}

                renderCustomView={(props) => this.renderCustomView(this.props.uid, props)}
                position = "None"
                />
        );
    }
}

const mapStateToDispatch = (state) =>({
    tabsNavigation: state.tabsNavigation,
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         resetRoute:(key) => dispatch(resetRoute(key)),
    }
}

const styles ={
    othertext:{
      fontFamily:'worksans-regular',
      
      fontSize: 11,
      color:'#333333',
      textAlign:'',
      marginTop:9,
      marginLeft:11,
      backgroundColor:'transparent',
      marginRight: 11,
    },
    uidtext:{
      fontFamily:'worksans-regular',
      fontSize: 11,
      
      marginLeft:11,
      color:'#FFFFFF',
      textAlign:'',
      marginTop:9,
      marginRight: 11,
      backgroundColor:'transparent'
    }
}

var mChat = connect(mapStateToDispatch, bindActions)(Chat)
//export default mChat;
export default WithMessageSubscription(mChat)
