import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, Radio, Button, Badge, Icon, RadioGroup, ListItem, Thumbnail } from 'native-base';
import Contacts from 'react-native-contacts';
import {View, ActivityIndicator, AlertIOS, ListView, InteractionManager} from 'react-native';
import {Actions,ActionConst} from 'react-native-router-flux';

import baseStyle from '../../themes/base-styles';
import SGListView from 'react-native-sglistview';
import * as db from '../../helpers/db';
import Friends from '../inputs/friendsInvite'
import Spinner from '../inputs/Spinner';
import {syncToStore, showError, pushRoute, popRoute , sendInvitation} from '../../actions/login';
import axios from 'axios';

 class  FriendsList extends Component{

  constructor(props){
    super(props);
    this.regUsers={}
    this.inviteUsers={}
    this.state ={
      registered: [],
      notregistered: [],
      loading:true
    }
  }

  sendInvitation(friends,username){
    if(friends == null)
        return;
    
    var friendsList=[]
    Object.keys(friends).forEach((v)=> { friends[v] && friendsList.push(v)})
    console.log("list ", friendsList)
    let AUTH_SERVER = "https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/invite"
    // send axios request to send Invitation
    return axios.post(AUTH_SERVER, {
            'phone': friendsList,
            'name' : username
        });
}

  handleSubmit(){
    const {user} = this.props;
    this.sendInvitation(this.inviteUsers, user.name)
      .then(() => Actions.tab5({type:ActionConst.JUMP}))//this.jumpTo('home_main'))
      .catch((error) => this.props.showError({message: error.message, title: 'Invite Error'}))
  }

  componentDidMount(){
     InteractionManager.runAfterInteractions(() => {
          this.setState({loading: true}, this.getContacts())
      })
  }

  getCollection(contacts){
    let collection = []
    
    contacts.map((v,i) => {
      let contact = { givenName: v.givenName, 
                      familyName: v.familyName, 
                      phoneNumbers: v.phoneNumbers,
                      key: i,
                      fullName: v.givenName + v.familyName
                    }
        if(v.phoneNumbers.length > 0)
          collection.push(contact);
    })

    db.filterCollection(collection)
        .then(({registered, notregistered}) => {
          sorted_nonregistered = this.sortArrayAsc(notregistered,'fullName')
          
            this.setState({registered,notregistered: sorted_nonregistered, loading: false})
        })
        .catch(err => console.log(err))
  }

  getContactGroups(listUsers){
    const groups = _.groupBy(listUsers, (user) => {
      return user.givenName.charAt(0).toUpperCase();
    });
    // sort group
    const keys = Object.keys(groups)
    const sortedKeys = _.sortBy(keys);
    const sortByKeys = _.fromPairs(
      _.map(sortedKeys, key => [key, groups[key]])
    );
    return sortByKeys;
  }

  onInviteSend(uid, registered, value){
    const {user} = this.props;
    let inviteOrFollowingUser = Object.assign({}, registered ? user.regUsers : user.inviteUsers);

    inviteOrFollowingUser[uid]  = value;

    if(registered){
      // we need it to send notification too and hence followUsers2 is required.
      db.followUsers2(user,uid,value);
      this.props.syncToStore({regUsers: inviteOrFollowingUser});
    }
    else {
      let inviteUsers = {}
      inviteUsers[uid] = value;
      // show popup to send Invite
      if(value){
        this.sendInvitation(inviteUsers, user.name);
      }

      this.props.syncToStore({inviteUsers: inviteOrFollowingUser}); 
    }
  }

  filterContacts(text){
    console.log("searching for text", text)
    Contacts.getContactsMatchingString(text, (err, contacts) => {
      if(err === 'denied'){
        // x.x
      } else {
        // Contains only contacts matching "filter"
        console.log("Contacts") 
        this.getCollection(contacts)
      }
    })
  }

  getContacts(){
      
      let contactList=null;
      Contacts.checkPermission( (err, permission) => {
  // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
  if(permission === 'undefined'){
    // this is the flow.
    // code should not be here.
    Contacts.requestPermission( (err, permission) => {
      if(permission === 'authorized'){
        // yay!
        Contacts.getAllWithoutPhotos((err, contacts) => {
            this.getCollection(contacts)
          })
      }
      else
        AlertIOS.alert('Permission Denied', 
                     "Can't access your contacts. Please allow the access to contacts in settings",
                     [{text: 'Ok', onPress: ()=>{this.setState({loading: false})}},
                 ])
    })
  }
  if(permission === 'authorized'){
    // yay!
    Contacts.getAllWithoutPhotos((err, contacts) => {
        this.getCollection(contacts)
      })
  }
  
  if(permission === 'denied'){
    // x.x
    AlertIOS.alert('Permission Denied', 
                     "Can't access your contacts. Please allow the access to contacts in settings",
                     [{text: 'Ok', onPress: ()=>{this.setState({loading: false})}},
                 ])
  }
})

  }

  sortArrayAsc(array,key){
    return array.sort(function(a,b){
      return b.fullName < a.fullName ? 1 :
             b.fullName > a.fullName ? -1  :
             0
    })
  }

  render(){
    
    const {registered, notregistered} = this.state
      return(
        <View style={{flex:1 }}>
          <Spinner visible={this.state.loading} />
        <Friends
          collection={{registered:[], "add contacts":notregistered}}
          loading={this.state.loading}
          onInviteSend={this.onInviteSend.bind(this)}
          user={this.props.user}
          onSearch={(text) => this.filterContacts(text)}
        />
        </View>
      );
    }
  }

const mapStateToDispatch = (state) =>({
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg)),
         resetRoute:(route) => dispatch(resetRoute(route)),
         sendInvitation:(inviteUsers, name) => dispatch(sendInvitation(inviteUsers, name))
    }
}

const styles = {
  row:{
    height: 50,
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowContent:{
    flex: 1,
    flexDirection:'row',
    marginLeft: 10
  }
}

export default connect (mapStateToDispatch,bindActions) (FriendsList);
