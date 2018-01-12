import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, Radio, Button, Badge, Icon, RadioGroup, ListItem, Thumbnail } from 'native-base';
import Contacts from 'react-native-contacts';
import {View, ActivityIndicator, ListView} from 'react-native';

import baseStyle from '../../themes/base-styles';
import SGListView from 'react-native-sglistview';
import * as db from '../../helpers/db';
import Friends from '../inputs/friendsInvite'


class  ContactList extends Component{

  constructor(props){
    super(props);
    this.state ={
      registered: [],
      notregistered: [],
      loading:true
    }
  }

  componentDidMount(){
    this.getContacts()
  }

  getCollection(contacts){
    let collection = []
    
    contacts.map((v,i) => {
      let contact = { givenName: v.givenName, 
                      familyName: v.familyName, 
                      phoneNumbers: v.phoneNumbers,
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
      Contacts.getAll((err, contacts) => {
        if(err && err.type === 'permissionDenied')
          console.log("contacts permission denied !");
        else
          this.getCollection(contacts)
      })
  }

  render(){
    
    const {registered, notregistered} = this.state
    return(
        <Friends
            collection={{registered, notregistered}}
            loading={this.state.loading}
            onInviteSend={this.props.onInviteSend}
            user={this.props.user}
        />
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

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    syncToStore: (userData) => dispatch(syncToStore(userData)),
  };
}

const mapStateToProps = state => ({
  user: state.login.user
});

export default connect(mapStateToProps, bindAction)(ContactList);
