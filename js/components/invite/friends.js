import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, Radio, Button, Badge, Icon, RadioGroup, ListItem, Thumbnail } from 'native-base';
import Contacts from 'react-native-contacts';
import {View, ActivityIndicator, AlertIOS, ListView, InteractionManager} from 'react-native';

import baseStyle from '../../themes/base-styles';
import SGListView from 'react-native-sglistview';
import * as db from '../../helpers/db';
import Friends from '../inputs/friendsInvite'
import Spinner from '../inputs/Spinner';

export default class  FriendsList extends Component{

  constructor(props){
    super(props);
    this.state ={
      registered: [],
      notregistered: [],
      loading:true
    }
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
                      thumbnail: v.thumbnailPath,
                      key: i
                    }
        if(v.phoneNumbers.length > 0)
          collection.push(contact);
    })

    db.filterCollection(collection)
        .then(({registered, notregistered}) => {
            this.setState({registered,notregistered, loading: false})
        })
        .catch(err => console.log(err))
  }

  getContacts(){
      
      let contactList=null;
      Contacts.checkPermission( (err, permission) => {
  // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
  if(permission === 'undefined'){
    Contacts.requestPermission( (err, permission) => {
    //console.log("permission ", permission);
    if(permission == "authorized"){
      Contacts.getAllWithoutPhotos((err, contacts) => {
        this.getCollection(contacts)
      })
    }
    if(permission == "denied"){
      console.log('permission', permission)
      AlertIOS.alert('Permission Denied', 
                     "Can't access your contacts. Please allow the access to contacts in settings",
                     [{text: 'Ok', onPress: ()=>{this.setState({loading: false})}},
                 ]) 
      }
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
  render(){
    
    const {registered, notregistered} = this.state
    
    return(
      <View>
      <Spinner visible={this.state.loading} />
        <Friends
            collection={{registered, "invite contacts":notregistered}}
            loading={this.state.loading}
            onInviteSend={this.props.onInviteSend}
            user={this.props.user}
        />
      </View>
      );
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
