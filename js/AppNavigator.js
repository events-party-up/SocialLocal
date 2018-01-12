
import React, { Component } from 'react';
import { BackAndroid, StatusBar,Text, View, NavigationExperimental,StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Drawer, Container,Button, Icon, Header,Title } from 'native-base';
import { actions } from 'react-native-navigation-redux-helpers';

import { openDrawer, closeDrawer } from './actions/drawer';

import Index from './components/index/';
import SplashPage from './components/splashscreen/';
import SideBar from './components/sideBar';
import Login from './components/login';
import Signup from './components/signup/newindex';
import services from './components/services/newindex';
import Profile from './components/profile';
import Invite from './components/invite';
import Home from './components/home';
import Modal from './components/misc/modal';
import Spinner from './components/misc/loading';
import Forgot from './components/login/forgotpassword';
import VerifyPhone from './components/signup/newVerifyPhone';
import EnterSMS from './components/signup/newEnterSMS';
import UserProfile from './components/signup/profile';
import { statusBarColor } from './themes/base-theme';
import Error from './components/error';
import LandingPage from './components/login/landingpage';
import NewLogin from './components/login/newlogin'
import Partyon from './components/partyon'
import Info from './components/partyon/info'
import PartyOnInvite from './components/partyon/invite';
import EventInfo from './components/partyon/eventinfo';
import PartyOnDetails from './components/partyon/details';
import PartyList from './components/partyon/list';

import SplashScreen from 'react-native-splash-screen'

const {
  popRoute,
} = actions;


const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
	Header: NavigationHeader,
  CardStack: NavigationCardStack,
} = NavigationExperimental

class AppNavigator extends Component {

  static propTypes = {
    drawerState: React.PropTypes.string,
    popRoute: React.PropTypes.func,
    closeDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      routes: React.PropTypes.array,
    }),
  }

  constructor(props){
    super(props);
    this.drawerEnabled = false;
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  componentDidMount() {
    SplashScreen.hide();
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = this.props.navigation.routes;

      if (routes[routes.length - 1].key === 'home' || routes[routes.length - 1].key === 'login') {
        return false;
      }

      this.props.popRoute(this.props.navigation.key);
      
      return true;
    });
  }

  // stop updating page when there is only login route change
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.drawerState !== this.props.drawerState || 
        nextProps.navigation !== this.props.navigation
    )
      return true;
    return false;
  }
  componentDidUpdate() {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this._drawer.close();
    }

    // change the state
    if(this.props.login.authenticated)
      this.drawerEnabled = true;
    else
      this.drawerEnabled = false;
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }

  _renderScene(props) { // eslint-disable-line class-methods-use-this
    
    const {route} = props.scene;
    switch (route.key) {
      case 'splashscreen':
        return <SplashPage />;
      case 'index':
        return <Index />;
      case 'login' :
        return <NewLogin />;
      case 'signUp':
        return <Signup />
      case 'locationService':
        return <services.LocationService />
      case 'pushService':
        return <services.PushService />
      case 'profile':
        return <Profile />
      case 'invite':
        return <Invite />
      case 'home':
        return <Home />
      case 'modal':
        return <Modal />
      case 'spinner':
        return <Spinner visible={true} />
      case 'forgot':
        return <Forgot />
      case 'verifyphone':
        return <VerifyPhone />
      case 'entersms':
        return <EnterSMS />
      case 'landingpage':
        return <LandingPage />
      case 'userprofile':
        return <UserProfile />
      case 'partyon':
        return <Partyon />
      case 'partyInfo':
        return <Info {...route}/>
      case 'partyInvite':
        return <PartyOnInvite {...route}/>
      case 'partyDetails':
        return <PartyOnDetails {...route}/>
      case 'partyList':
        return <PartyList {...route}/>
      case 'mapinfo':
        return <EventInfo {...route} />
      default:
        return <Index />;
    }
  }

  _renderCard(props){
    return ( <NavigationCard
                {...props}
                style={props.scene.route.key === 'Modal' ?
										NavigationCard.CardStackStyleInterpolator.forVertical(props) :
										undefined
							}
              onNavigateBack={() => this.popRoute()}
              panHandlers={props.scene.route.key === 'Modal' ? null : undefined }
              renderScene={this._renderNavigation}
              key={props.scene.route.key}
              />
      );
  }

  _renderNavigation(props){

    return (<Error style={{flex: 1}}>
            {this._renderScene(props)}
    </Error>);
  }

  _renderHeader(props){
    if(props.scene.route.title){
      
      return <NavigationHeader {...props}
              onNavigateBack={()=> this.popRoute()}
              renderTitleComponent={props => {
                const title = props.scene.route.title
                return title && <NavigationHeader.Title>{title}</NavigationHeader.Title>
              }}
            />
    }
              
  }

  render() {
    
    
    return (
      <Drawer
        ref={(ref) => { this._drawer = ref; }}
        type="overlay"
        tweenDuration={150}
        content={<SideBar navigator={this._navigator} />}
        tapToClose
        acceptPan={this.drawerEnabled}
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        styles={{
          drawer: {
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 3,
          },
        }}
        tweenHandler={(ratio) => {  //eslint-disable-line
          return {
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: {
              opacity: (2 - ratio) / 2,
            },
          };
        }}
        negotiatePan
      >
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle="light-content"
        />
        <NavigationCardStack 
          navigationState={this.props.navigation}
          renderScene={this._renderNavigation.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
        />
      </Drawer>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: ()  => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: (key) => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  navigation: state.cardNavigation,
  login: state.login
});

export default connect(mapStateToProps, bindAction)(AppNavigator);
