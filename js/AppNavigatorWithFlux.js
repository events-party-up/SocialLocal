import React, {Component} from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
/*** Drawer ***/
import Drawer from './components/misc/Drawer';

/*** LOGIN SCREENS  ***/
import Login from './components/login/newlogin';
import Forgot from './components/login/forgotpassword';
import ForgotPasswordConfirmation from './components/login/forgetPasswordConfirmation'
import PasswordSent from './components/login/PasswordSent'
import Terms from './components/login/terms'
import Privacy from './components/login/privacy'

import { connect } from 'react-redux';

/*** SIGNUP SCREENS ***/
import LandingPage from './components/login/landingpage';
import FirstPage from './components/login/firstpage'
import Signup from './components/signup';
import VerifyPhone from './components/signup/verifyPhone';
import EnterSMS from './components/signup/enterSMS';
import UserProfile from './components/signup/profile';
import Invite from './components/invite';

/*** Home Screen ***/
import Home from './components/home';
import EventList from './components/home/list';
import FindPeopleHome from './components/home/findPeople'
import Header from './components/inputs/Header';
import TabView from './components/inputs/TabView';
import TabIcon from './components/inputs/TabIcon';

/*** ERROR ***/
import Error from './components/inputs/Error';

/*** Services ***/
import services from './components/services';

/*** Others ***/
import Noop from './components/misc/Noop';

/*** Party On ***/
import Partyon from './components/partyon'
import Info from './components/partyon/info'
import PartyOnInvite from './components/partyon/invite';
import EventInfo from './components/partyon/eventinfo';
import PartyOnDetails from './components/partyon/details';
import PartyList from './components/partyon/list';
import InviteFromPhone from './components/partyon/InviteFromPhone'

import MemberList from './components/partyon/invitedMembers';
import EditParty from './components/partyon/editParty';

/*** Profile ***/
import Profile from './components/profile/ProfilePage';
import EditProfile from './components/profile/edit';
import EditOptions from './components/profile/edit_options';
import ChangePassword from './components/profile/changePassword'
import FindPeople from './components/profile/findPeople'
import FindPeopleFromPhone from './components/profile/findFromContact'
import BlockedList from './components/profile/blockedList'
import Instruction from './components/instructions'
/**  Notifications  **/
import NotificationList from './components/notifications'

/** Messages **/
import MessagePage from './components/messages'
import GroupsPage from './components/messages/groups'

import {signUpUser} from './actions/login';

import {Scene, Reducer, Router, Switch, Modal, Actions, ActionConst } from 'react-native-router-flux';

const drawer = require('../images/drawer.png');
const back_arrow = require('../images/BackArrowTwoxWhite.png');
const home_selected = require('../images/Home-Selected.png');
const home_unselected = require('../images/Home-Unselected.png');
const profile_selected = require('../images/Profile-Selected.png');
const profile_unselected = require('../images/Profile-Unselected.png');
const actionButton = require('../images/Action-Unselected.png');
const messages_selected = require('../images/Messages-Selected.png');
const messages_unselected = require('../images/Messages-Unselected.png');
const notifications_selected = require('../images/Notifications-Selected.png');
const notifications_unselected = require('../images/Notifications-Unselected.png');



const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
      
    return defaultReducer(state, action);
  };
};

// define this based on the styles/dimensions you use
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#ffffff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

class Navigation extends Component {

    constructor(props){
      super(props);

    }
    
    render(){
        return (
            <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle} 
            navigationBarStyle={styles.navBar} 
            titleStyle={styles.titleText} 
            rightButtonTextStyle={styles.rightText} 
            backButtonImage={back_arrow} 
            leftButtonStyle={styles.iconbg} 
            leftButtonIconStyle={styles.backImage} 
            leftButtonTextStyle={styles.rightText}
            tabBarStyle={{height: 50, backgroundColor:'#f9f5f4', justifyContent:'center', alignItems:'center'}}
            >
                <Scene key="modal" component={Modal}>
                   
                    <Scene key="root" >
                        <Scene key="firstpage" hideNavBar={true} component={FirstPage} initial type={ActionConst.RESET} hideTabBar={true}/>
                        <Scene key="landingpage" hideNavBar={true} component={LandingPage}  type={ActionConst.RESET}/>
                        <Scene key="login" component={Login}  hideNavBar={false} title="Welcome Back" />
                        <Scene key="signUp" component={Signup} hideNavBar={false} title="Sign Up" />
                        <Scene key="verifyphone" component={VerifyPhone} hideNavBar={false} title="Sign Up" />
                        <Scene key="entersms" component={EnterSMS} hideNavBar={false} title="Sign Up" />
                        <Scene key="userprofile" component={UserProfile}  hideNavbar={false} title="Sign Up" />
                        <Scene key="locationService" component={services.LocationService} hideNavBar={false} title="Location Services" />
                        <Scene key="pushService" component={services.PushService} hideNavBar={false} title="Notifications" />
                        <Scene key="invite"  component={Invite}  title="People" hideNavBar={false} hideTabBar={true} 
                              rightTitle="Done" onRight={_.debounce(this.props.signUpUser, 1000)}/>
                        <Scene key="echo" component={Home} hideNavBar={true}/>  
                        <Scene key="forgot" component={Forgot} hideNavBar={false} title="Reset Password" />
                        <Scene key="forgotPasswordConfirmation" component={ForgotPasswordConfirmation} hideNavBar={false} title="Reset Password" />
                        <Scene key="passwordSent" component={PasswordSent} hideNavBar={false} title="Reset Password" />
                        <Scene key="terms" component={Terms} hideNavBar={false} hideTabBar={true} title="Terms & Conditions" />
                        <Scene key="privacy" component={Privacy} hideNavBar={false} hideTabBar={true} title="Privacy Policy" />
                    </Scene>
                    <Scene key="instruction" type='reset' hideNavBar={true}>
                      <Scene key="slides" initial component={Instruction} hideNavBar={true}/>
                    </Scene>
                    <Scene key="home" type='reset' hideNavBar={true}>
                      <Scene key="main" tabs >
                        <Scene key="tab1" initial
                              title="Home"
                              icon={TabIcon}
                              selectedIcon={home_selected}
                              unselectedIcon={home_unselected}
                              type={ActionConst.REFRESH}
                          >
                          <Scene key="homescreen" type={ActionConst.RESET}>
                            
                            <Scene key="Maps" type={ActionConst.RESET}>
                              <Scene key="MapsMain" initial title="Socialvite" component={Home} />
                              <Scene key="findPeopleHome" component={FindPeopleHome} title="Find People" />
                            </Scene>
                            <Scene key="List" clone component={EventList} title="Socialvite" type={ActionConst.REFRESH} />
                            <Scene key="partyon"  component={Partyon} hideNavBar={false} 
                              hideTabBar={true} title="Party On" direction='vertical' type="push" 
                            />
                            <Scene key="partyInvite"  invite component={PartyOnInvite} hideNavBar={false} 
                              hideTabBar={true} title="Invite" rightTitle="Next" 
                              
                            />
                            <Scene key="partyInfo" component={Info} hideNavBar={false} 
                              hideTabBar={true} title="Details"
                            />
                            <Scene key="mapinfo" component={EventInfo} hideNavBar={false}  type={ActionConst.REFRESH}
                              hideTabBar={true} getTitle={(props)=> props.event && props.event.info.name} />
                            <Scene key="inviteFromPhone" title="Invite Contacts" component = {InviteFromPhone}/> 
                            <Scene key="invitedMembers" title="People" component = {MemberList}/> 
                            <Scene key="editParty" component = {EditParty} title="Edit" rightTitle="Done" hideTabBar={true} /> 
                            <Scene key="partyList" hideNavBar={false} navBar={Header} 
                                  tabsList={['Invited','Going']} leftButtonIcon='arrow-back' 
                                  onLeftButtonClicked={()=>Actions.pop()} 
                                    rightButtonEnabled={false}>
                            
                                <Scene key="Invited" index={0}  component={PartyList} />
                                <Scene key="Going" clone index={1} component={PartyList}/>
                            </Scene>

                          </Scene>
                        </Scene>
                        <Scene key="tab2"
                          icon={TabIcon}
                          selectedIcon={messages_selected}
                          unselectedIcon={messages_unselected}
                          type={ActionConst.REFRESH}
                        >
                          <Scene key="message" component={GroupsPage} initial title="Messages" type={ActionConst.REFRESH}  />
                          <Scene key="chat" component={MessagePage} />
                        </Scene>
                        <Scene key="tab3"
                          icon={TabIcon}
                          selectedIcon={actionButton}
                          unselectedIcon={actionButton}
                          onPress={()=> {Actions.callback({ key: 'homescreen', type: 'reset'}); Actions.partyon({animation:'fade',type: ActionConst.RESET}) }}
                        >
                        </Scene>
                        <Scene key="tab4"
                          icon={TabIcon}
                          selectedIcon={notifications_selected}
                          unselectedIcon={notifications_unselected}
                          type={ActionConst.REFRESH}
                        >
                          <Scene key="notifications" title="Notifications" component={NotificationList}  />
                        </Scene>

                        <Scene key="tab5"
                          title="Profile"
                          icon={TabIcon}
                          selectedIcon={profile_selected}
                          unselectedIcon={profile_unselected}
                          middleContentEnabled={false}
                          rightButtonEnabled={false}
                          type={ActionConst.REFRESH}
                          hideNavBar={false}
                        >

                          <Scene key="Profile_screen" component={Profile} title="PROFILE"
                           initial rightButtonEnabled={true} />
                          <Scene key="editProfile"  title="Edit Profile" component={EditProfile} rightTitle="Save" />
                          <Scene key="editOptions" title="Options" component={EditOptions} />
                          <Scene key="changePassword" title="Change Password" component={ChangePassword} />
                          <Scene key="findPeople" title="Find People" component={FindPeople} />
                          <Scene key="findPeoplePhone" title="Invite Friends" component={FindPeopleFromPhone} />
                          <Scene key="viewProfile" title="View"  component= {Profile}/>
                          <Scene key="blockedList" title="Blocked"  component= {BlockedList} />

                        </Scene>
                      </Scene>
                    </Scene>
                    
                    <Scene key="error" component={Error} />
                    
                    <Scene key="noop" component={Noop} hideNavBar={false} type={ActionConst.RESET} />
                </Scene>
            </Router>
        );
    }
}

function bindAction(dispatch) {
  return {
    openDrawer: ()  => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: (key) => dispatch(popRoute(key)),
    signUpUser: () => dispatch(signUpUser())
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindAction)(Navigation);

const styles={
  navBar:{
    backgroundColor:'#5F7EFE',
  },
  titleText:{
    color: '#ffffff',
    fontSize:17,
    fontWeight: '600',
    fontFamily: 'worksans-regular'
  },
  rightText:{
    color:'#ffffff',
  },
  iconbg:{
  },
  backImage:{
    width:18,
    height:21,
    padding:5,
  }
}
