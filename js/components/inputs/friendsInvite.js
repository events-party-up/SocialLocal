import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Container, Content, Text, List, Radio, Button, Badge, Icon, RadioGroup, ListItem, Thumbnail,Input, InputGroup } from 'native-base';
import Contacts from 'react-native-contacts';
import {Image, View, ListView, ActivityIndicator,InteractionManager} from 'react-native';
import SGListView from 'react-native-sglistview';
import baseStyle from '../../themes/base-styles';
import stylesCommon from '../profile/styles';
import InviteButton from './InviteButton';
import Spinner from './Spinner';
import ActionFFButton from './ActionFFButton';
import BEMCheckBox from 'react-native-bem-check-box';
import theme from '../../themes/base-theme';
import * as search from '../../helpers/search';

const logo  = require('../../../images/social-logo.png');
const blankphoto = require('../../../images/photo.png');
const glow2 = require('../../../images/glow2.png');
export default class  FriendsList extends Component{

  constructor(props){
    super(props);
    this.state ={
      collection: [],
      loading:true,
      searchText: ''
    }
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 ,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this.invites={}
  }

  static propTypes ={
      onInviteSend: React.PropTypes.func.isRequired,
      defaultState: React.PropTypes.bool,
      registered: React.PropTypes.array,
      notregistered: React.PropTypes.array,
      loggedInUser: React.PropTypes.object,
      user: React.PropTypes.object
  }

  static defaultProps = {
    defaultState: true,
    isDisabled: false
  }

  componentWillReceiveProps(nextProps, nextState){
    
    if(nextProps !== this.props){
      const {collection, loading} = nextProps;
      this.setState({
        collection, 
        loading,
        searchText: '',
        dataSource: this.ds.cloneWithRowsAndSections(collection),
      });
    }
  }

  setSearchText(event) {
    let searchText = event && event.nativeEvent.text;
    if(!event){
      searchText = this.state.searchText;
    }
    let searchResult = search.filterSearchDataFindContactPageOptions(this.state.collection, searchText);
    this.setState({
       dataSource: this.ds.cloneWithRowsAndSections(searchResult),
       searchText: searchText
     });
  }

  renderDivider(){
    return(<ListItem key='divider' itemDivider>
              <Text> Invite </Text>
            </ListItem>
          );
  }

  onInviteSend(uid, registered, value){
    // on invite send
    this.invites[uid] = value;
    this.props.onInviteSend(uid, registered, value);
  }

  renderRightIcon(item, sectionID,isFollowing){
    const number = _.get(item,'phoneNumbers[0].number')
    
    if(sectionID === 'registered'){
      let regUsers = _.get(this.props.user,'regUsers');
      regUsers = Object.assign({},regUsers, this.invites)
      let state = false;
      if(regUsers && regUsers[item.uid]){
        state = true;
      }
      // this is not valid if uid is not known. Sign up case. hence correcting it
      if(this.props.user && this.props.user.uid && item.uid === this.props.user.uid)
        return;

      return <ActionFFButton active={state}
              userName={item.givenName}
              ctype='follow'
              onPress={(value)=> this.onInviteSend(item.uid,true,value)}
      />
    }
    else{
      let invitedPeople = _.get(this.props.event,'inviteUsers');
      invitedPeople = Object.assign({},invitedPeople, this.invites)
      let state = false;
      if(invitedPeople && invitedPeople[number]){
        state = true;
      }
      return <ActionFFButton active={state}
                ctype='invite'
                userName={item.givenName}
                activeText='Invited'
                inactiveText='Invite'
                onPress={(value)=>this.onInviteSend(number,false,value)}
            />
    }
  }

//<Thumbnail circular size={50} source={{uri: thumbnail}} />
  renderRow(item, sectionID, rowID){
      const {givenName, familyName, uid } = item;
      let regUsers = _.get(this.props, 'user.regUsers');
      let isFollowing = regUsers && regUsers[item.uid];
      return(
        <ListItem key={item.key}>
          <View style={styles.row}>
            <View style={styles.rowContent}> 
              <Text style={Object.assign({}, baseStyle.regulartext, {marginLeft: 15,alignSelf:'center' })}>{givenName} {familyName}</Text>
            </View>
            {this.renderRightIcon(item, sectionID,isFollowing)}
          </View>
        </ListItem>
      );
  }

  renderSectionHeader(sectionData, category){

      if(category === 'registered')
        return null;
      return (
        <View style={baseStyle.divider}>
          <Text style={{fontSize: 12, marginLeft: 16,color: '#9B9B9B',fontFamily: 'worksans-regular'}}>{category.toUpperCase()}</Text>
        </View>
      )
  }

  renderContent1(){
    return(
      <View style={{backgroundColor: '#dcdcdc',padding:5}} >
        <InputGroup style={stylesCommon.inviteSearch}>
          <Icon name="ios-search" style={stylesCommon.findPeopleSearchIcon} />
          <Input placeholder="Search" 
            style={{marginTop: 7,fontSize:14,textAlignVertical:'center'}}
            value={this.state.searchText}
            onChange={this.setSearchText.bind(this)}
          />
        </InputGroup>    
      </View>
    );
  }

  renderContacts(){
    return (<View>
              <View style={{backgroundColor:'#dcdcdc'}} >
              {this.renderContent1()}
            </View>
            <SGListView 
                keyboardShouldPersistTaps="always"
                dataSource={this.state.dataSource}
                initialListSize={100}
                pageSize={1}
                renderRow={this.renderRow.bind(this)}
                renderSectionHeader={this.renderSectionHeader}
                
                onEndReachedThreshold={1}
                scrollRenderAheadDistance={5}
                enableEmptySections={true}
            />
          </View>);
  }

  render(){
    return  !this.state.loading && this.renderContacts()
  }
}

const styles = {
  row:{
    height: 40,
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowContent:{
    flex: 1,
    flexDirection:'row'
  },
  checkbox:{
    width: 22,
    height:22,
    marginRight: 22
  }
}
