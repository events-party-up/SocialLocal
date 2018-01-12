import React, {Component} from 'react';

/* Open source modules */
import {View, Image,  LayoutAnimation, InteractionManager, NavigationExperimental } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title, Thumbnail} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import Contacts from 'react-native-contacts';
import {Actions} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Map from '../inputs/Map';
import * as db from '../../helpers/db';
import HeaderContent from '../inputs/Header'
import FriendsInvite from '../inputs/friendsInvite'
import {WithEventSubscription} from '../misc/WithEventSubscription';
import {pushRoute, popRoute, showError} from '../../actions/login';
const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const party = require('../../../images/party.jpg');

/* Component class */

class List extends Component{

    constructor(props){
        super(props);
        this.state = {
          invited: [],
          going: [],
          loading:true
        }
        // set invited going from event users
        //this.fillUsers(this.props.event);
    }

    componentDidMount(){
        Actions.refresh({onLeft: this.popRoute.bind(this), leftTitle:'Back', onRight:null})
    }

    popRoute(){
        this.props.popRoute();
    }

    onButtonClicked(uid, invite){

    }

    fillUsers(event){
        
        db.getUsersData(event.users)
            .then((users) => {
                let invited = _.filter(users,{'status':'invited'})
                let going = _.filter(users,{'status':'going'})
                this.setState({invited, going, loading:false});
            });
    }

    componentWillReceiveProps(nextProps, nextState){
        if(this.props.event !== nextProps.event){
            this.fillUsers(nextProps.event)
        }
    }
    
  getContacts(){
    // get the list of invited and going from db
    db.getUsers(this.props.event.id)
        .then(({invited, going}) => {
            
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            this.setState({invited, going, loading:false})
        })     
  }


  _renderScene(props){
      const {invited, going} = this.state;
      switch(props.index){
          case 0:
           return(  <View style={{flex: 1, backgroundColor:'#FFF'}}>
                <Content>
                    <FriendsInvite 
                        collection={{invited}}
                        loading={this.state.loading}
                        onInviteSend={this.onButtonClicked.bind(this)}
                        defaultState={true}
                        isDisabled={true}
                    />
                </Content>
            </View>
           );

          case 1:
           return(  <View style={{flex: 1, backgroundColor:'#FFF'}}>
                <Content>
                    <FriendsInvite 
                        collection={{going}} 
                        loading={this.state.loading}
                        onInviteSend={this.onButtonClicked.bind(this)}
                        defaultState={true}
                        isDisabled={true}
                    />
                </Content>
            </View>
           );

          default:
            return(
                <View style={{flex: 1}}>
                <Text> Default case </Text>
            </View>
            )
      }
  }
    

    render(){
        return(
        <Container theme={theme}>
             
            <View style={baseStyle.line}/>
            <Image source={glow2} style={baseStyle.container}>
                {this._renderScene(this.props)}
            </Image> 
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         resetRoute: (route) => dispatch(resetRoute(route)),
         showError:(msg, cb) => dispatch(showError(msg, cb))
    }
}

var listComp = connect(mapStateToDispatch, bindActions)(List)
export default WithEventSubscription(listComp);