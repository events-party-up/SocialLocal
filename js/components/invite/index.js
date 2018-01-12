import React, {Component} from 'react';

/* Open source modules */
import {View, Image,Dimensions } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title} from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FriendsList from './friends'
import {showError, syncToStore, signUpUser, pushRoute, popRoute} from '../../actions/login';
import * as db from '../../helpers/db';


const glow2 = require('../../../images/glow2.png');
const deviceWidth = Dimensions.get('window').width;

const back_arrow  = require('../../../images/Back-Arrow-Black.png');
import {Actions} from 'react-native-router-flux';

class Contacts extends Component{

  static propTypes = {
    popRoute: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    })
  }

  constructor(props){
    super(props);
    this.regUsers={}
    this.inviteUsers={}
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route });
  }
  componentWillMount(){
        Actions.refresh({navigationBarStyle:{backgroundColor:'#F8F8F8'},titleStyle:{color: '#333333',fontSize:17},backButtonImage:back_arrow, rightButtonTextStyle: {color:'#000', fontSize: 14, marginTop: 5 }})
  }

  sendInvitation(friends,username){
    if(friends == null)
        return;
    
    var friendsList=[]
    Object.keys(friends).forEach((v)=> { friends[v] && friendsList.push(v)})
    console.log("send invitation", friendsList);
    let AUTH_SERVER = "https://rfmdpuov4b.execute-api.us-west-2.amazonaws.com/prod/invite"
    // send axios request to send Invitation
    return axios.post(AUTH_SERVER, {
            'phone': friendsList,
            'name' : username
        });
  }

  shouldComponentUpdate(){
    return false;
  }


   onInviteSend(uid, registered, value){
     const {user} = this.props;
     
    let inviteOrFollowingUser = Object.assign({}, registered ? _.get(user,'regUsers') : _.get(user,'inviteUsers'));

    inviteOrFollowingUser[uid]  = value;

    if(registered){
      this.regUsers[uid] = value;
      this.props.syncToStore({regUsers: inviteOrFollowingUser});
    }

    else {
      let inviteUsers = {};
      inviteUsers[uid] = value;

      
      if(value){
        console.log('send invitation', uid);
        this.sendInvitation(inviteUsers, user.name ? user.name : 'Blank');
      }

      this.props.syncToStore({inviteUsers: inviteOrFollowingUser}); 
    }
  }

  render(){
    return(
       
              <View style={{flex:1}} >
                <View style={{backgroundColor:'#D1D2D1'}} >
                    <View style={_.assign({},baseStyle.progressBar,{width:(deviceWidth*7/8)})}/>
                </View>
                <View style={baseStyle.line}/>
                
                  <FriendsList
                    onComplete={this.props.signUpUser}
                    onInviteSend={this.onInviteSend.bind(this)}
                    user={this.props.user}
                  />
                
              </View>
       
  );
  }

}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    syncToStore: (userData) => dispatch(syncToStore(userData)),
    signUpUser: ()=> dispatch(signUpUser())
  };
}

const mapStateToProps = state => ({
  user: state.login.user
});

export default connect(mapStateToProps, bindAction)(Contacts);
