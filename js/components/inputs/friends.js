import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Text, List, Radio, Button, Badge, Icon, Header,Title, RadioGroup, ListItem, Thumbnail } from 'native-base';
import Contacts from 'react-native-contacts';
import {View, ListView, FlatList, ActivityIndicator,TouchableOpacity,Image} from 'react-native';
import SGListView from 'react-native-sglistview';
import Spinner from './Spinner';
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import InviteButton from './InviteButton';
import BEMCheckBox from 'react-native-bem-check-box';

const logo  = require('../../../images/social-logo.png');
const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const nextScreen = require('../../../images/Next-Screen.png');
const inviteIcon = require('../../../images/Socialvite_Icons_InviteContacts.png')

export default class  FriendsList extends Component{

  constructor(props){
    super(props);
    this.state ={
      collection: [],
      loading:true,
      inviteAll: false,
    }
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
  }

  static propTypes ={
      onInviteSend: React.PropTypes.func.isRequired,
      defaultState: React.PropTypes.bool,
  }

  static defaultProps = {
    defaultState: false,
    isDisabled: false
  }

  componentWillReceiveProps(nextProps, nextState){
    
    if(!_.isEqual(nextProps.collection, this.props.collection)){
      let {collection, loading} = nextProps;

      collection.dataSource = this.sortArrayAsc(collection.dataSource, 'givenName')      
      this.setState({
        collection, 
        loading, 
        dataSource: this.ds.cloneWithRowsAndSections(collection),
    })
    }
  }

    sortArrayAsc(array,key){
    
      return array.sort(function(a,b){
        return b[key] < a[key] ? 1 :
               b[key] > a[key] ? -1  :
               0
      })
    }


  renderDivider(){
    return(<ListItem key='divider' itemDivider>
              <Text> Invite </Text>
            </ListItem>
          );
  }


  renderRightIcon(item, value){
    const {phoneNumbers} = item;
    const number = _.get(item,'phoneNumbers[0].number')
    
    if(item.uid){
      return  <BEMCheckBox
              style={styles.checkbox}
              tintColor='#5F7EFE'
              onFillColor='#5F7EFE'
              onTintColor='#5F7EFE'
              onCheckColor='#FFF'
              lineWidth={1}
              value={value || this.props.inviteAll}
              onValueChange={value => this.props.onInviteSend(item.uid, true,value)}
              />
    }
    else{
      return <InviteButton active={this.props.defaultState} 
                onPress={this.props.onInviteSend.bind(null,number,false,)}
                isDisabled={this.props.isDisabled}
            />
    }
  }

//<Thumbnail circular size={50} source={{uri: thumbnail}} />
  renderRow(item){
    
      const {givenName, familyName, thumbnail, uid,userName } = item;
      const {invitedList } = this.props
      
      let thumbnailSrouce = thumbnail ? {uri: thumbnail} : blankphoto;

      return(
          <ListItem key={item.key}>
          
          <View style={styles.row}>
            <Image style={{width:40,height:40,borderRadius:20}} source={thumbnailSrouce} />
            <View style={styles.rowContent}>            
              <Text style={Object.assign({}, baseStyle.profileRowText, { alignSelf:'flex-start' })}>{givenName} {familyName}</Text>
              <Text style={Object.assign({}, baseStyle.profileRowSubText, {alignSelf:'flex-start'})}>{userName} {familyName}</Text>
            </View>
            {this.renderRightIcon(item, invitedList[uid])}
          </View>
        </ListItem>
      );
  }

  renderSectionHeader(sectionData, category){
      if(category === 'registered')
        return null;
      return (
        <View style={_.assign({},baseStyle.divider,{flexDirection:'row',justifyContent:'center',padding:5})}>
                <Text style={Object.assign({},baseStyle.regularText,{fontSize: 11,flex:1, marginLeft: 10,alignSelf:'center'})}>INVITE</Text>
                <Text style={Object.assign({},baseStyle.regularText,{fontSize: 11,flex:1, marginRight: 10,textAlign:'right',alignSelf:'center'})}>Invite All</Text>
                <BEMCheckBox
                  style={_.assign({},styles.checkbox,{marginRight:10, marginBotton: 2})}
                  tintColor='#5F7EFE'
                  onFillColor='#5F7EFE'
                  onTintColor='#5F7EFE'
                  onCheckColor='#FFF'
                  lineWidth={1}
                  onValueChange={value => {this.props.onInviteAll(value); } }
                />
            </View>
      )
  }

  renderFindContacts(){
    return(
      <TouchableOpacity style={{flexDirection:'row',height:44, padding:16}} onPress={this.props.onFindContacts}>    
        <Text style={Object.assign({},baseStyle.regulartext,{fontSize: 15, flex:1, marginRight: 10,textAlign:'left',alignSelf:'center'})}>Invite Contacts via Text</Text>
        <Image style={styles.editOptionsTabIcon} source={inviteIcon} />
      </TouchableOpacity>
    );
  }

  renderInviteSection(){
    return(
      <View style={{flexDirection:'row',height:44, padding:16}} >    
        <Text style={Object.assign({},baseStyle.regulartext,{fontSize: 15, flex:1, marginRight: 10,textAlign:'left',alignSelf:'center'})}>Invite All</Text>
        <BEMCheckBox
          style={_.assign({},styles.checkbox)}
          tintColor='#5F7EFE'
          onFillColor='#5F7EFE'
          onTintColor='#5F7EFE'
          onCheckColor='#FFF'
          lineWidth={1}
          onValueChange={value => {this.props.onInviteAll(value); this.setState({inviteAll: value})  } }
        />
      </View>
    );
  }

  render(){
    
    return<View style={{flex: 1}}>
          {this.renderFindContacts()}
          
          <View style={baseStyle.divider}/>
          {this.renderInviteSection()}
          <View style={baseStyle.line}/>

        <FlatList
           data={this.state.collection.dataSource}
          renderItem={({item, index}) => this.renderRow.bind(this)(item)}
          extraData={this.state}
        />

          </View>
  }
}

const styles = {
  row:{
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent:{
    flex: 1,
    flexDirection:'column',
  },
  checkbox:{
    width: 22,
    height:22,
    marginTop: -5,
  },
  editOptionsTabIcon:{
    width: 22,
    height:22,
    marginTop: -5,
  }
}
