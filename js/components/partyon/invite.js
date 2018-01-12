import React, {Component} from 'react';

/* Open source modules */
import {View, Image } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title,Input,InputGroup} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import Contacts from 'react-native-contacts';
import {Actions} from 'react-native-router-flux';
/* Themes modules */

import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FriendsList from '../inputs/friends'
import * as db from '../../helpers/db';
import { showError, pushRoute, popRoute } from '../../actions/login';
import {SubscribeUser} from '../misc/SubscribeUser';
import Spinner from '../inputs/Spinner';

import * as search from '../../helpers/search';
import styles from './styles';


const glow2 = require('../../../images/glow2.png');

class Invite extends Component{

  static propTypes = {
    popRoute: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    })
  }

  constructor(props){
      super(props);
      this.state ={
          registered: [],
          loading: true,
          dataSource: [],
          searchText: '',
          regUsers: {},
          inviteAll: false,
          editInvite: this.props.editInvite
      }
      this.regUsers = _.mapValues(props.data.users,(value) => value==="invited" || value === "going")
      
      //this.regUsers = {}
      this.inviteUsers = props.data.inviteUsers ? props.data.inviteUsers : {}
      this.getFollowers = _.debounce(this.getFollowers, 1000);
  }

  static defaultProps={
    uid: 'EDyG2WcZRdUkSCF7rzrl1m9F34I3'
  }

  pushRoute(route) {
    let {data} = this.props;
    const {regUsers, onInviteSend, inviteUsers} = this;
    data['inviteUsers'] = inviteUsers
    
    this.props.pushRoute({ key: route, data, regUsers, onInviteSend: this.onInviteSend.bind(this)});
  }

  popRoute(){
      this.props.popRoute(this.props.navigation.key);
  }

  componentWillMount(){
      //this.getContacts();

      this.getFollowers();
  }

  onEditInvite(){
    let data  = this.props.data
    data['name'] = data.info.name
    data['inviteUsers'] = this.inviteUsers
    db.updateEventData(data, this.regUsers,this.props.user)
      .then(() => this.props.popRoute())
      .catch((error) => { this.props.showError( {message:"Error on saving"+error, title:'PARTY ON ERROR!'}) })
  }

  componentDidMount(){
    if(!this.props.editInvite)
      Actions.refresh({onRight: this.pushRoute.bind(this,'partyInfo')})
    else
      Actions.refresh({onRight: this.onEditInvite.bind(this), rightTitle: 'Done'})
  }

  getFollowers(){
    // get the followers
    let self = this;
    let registered = [];
    db.getFollowers(this.props.user.uid,this.props.data.info.location)
      .then((followers)=>{
        
        _.map(followers,function(fw){
          let contact = {
            givenName: fw.name,
            userName:fw.username,
            familyName: '',
            phoneNumbers: [fw.phone],
            thumbnail: fw.photo,
            uid: fw.uid
          }
          let blockedUsers = Object.assign({}, self.props.user.blockedUsers);
          if(!blockedUsers[fw.uid]){
            registered.push(contact);
          }
        })
      }).then(()=> this.setState({registered, loading:false, dataSource: registered}))
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
  inviteAll(invite){
      const {regUsers, inviteUsers} = this;
      if(invite){
        _.each(this.state.dataSource,function(data){
                regUsers[data.uid]=invite;
        });
      }else{
        _.each(this.state.dataSource,function(data){
          regUsers[data.uid]=false;
        });
      }
      
      this.setState({inviteAll: invite})
  }
  onInviteSend(uid, registered, invite){
    
    console.log("SETTIGN DATA HERE ", this.inviteUsers)
    if(registered){
      // follow them
      this.regUsers[uid]=invite;

    }else{
      // send invitation through sms
      this.inviteUsers[uid]=invite;
    }
  }

  setSearchText(event) {
    let searchText = event && event.nativeEvent.text;
    if(!event){
      searchText = this.state.searchText;
    }
    let searchResult = search.filterContactSearch(this.state.registered, searchText);
    
    this.setState({
       dataSource: searchResult,
       searchText: searchText
     });
  }

  componentWillReceiveProps(nextProps, nextState){
    
    if(nextProps.isReady){
      this.getFollowers();
    }
  }

  renderContent1(){
    return(
      <View style={{backgroundColor: '#dcdcdc',padding:5}} >
        <InputGroup style={styles.inviteSearch}>
          <Icon name="ios-search" style={styles.findPeopleSearchIcon} />
          <Input placeholder="Search" 
            style={{marginTop: 7,fontSize:14}}
            placeholderTextColor="#979797"
            value={this.state.searchText}
            onChange={this.setSearchText.bind(this)}
          />
        </InputGroup>    
      </View>
    );
  }

  render(){
    
    const {dataSource} = this.state;
    return(
       
          <View style={{flex:1 }}>
                  <Spinner visible={this.state.loading} />
                  {this.renderContent1()}
                  <FriendsList
                    collection={{dataSource}} 
                    loading={this.state.loading}
                    invitedList={this.regUsers}
                    onInviteSend={this.onInviteSend.bind(this)}
                    onInviteAll={this.inviteAll.bind(this)}
                    inviteAll={this.state.inviteAll}
                    onFindContacts={this.pushRoute.bind(this, "inviteFromPhone")}
                    />
                
                
          </View>
  );
  }

}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    pushRoute: (route) => dispatch(pushRoute(route)),
    showError:(msg, cb) => dispatch(showError(msg, cb))
  };
}

const mapStateToProps = state => ({
  user: state.login.user
});

var Invite2 = connect(mapStateToProps, bindAction)(Invite);
export default SubscribeUser(Invite2);
