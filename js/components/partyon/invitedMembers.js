import React, {Component} from 'react';

/* Open source modules */
import {View, Image,  LayoutAnimation, InteractionManager, NavigationExperimental,ListView,TouchableOpacity } from 'react-native'
import { Container, Text, Content, Button, Header, Icon , Title, Thumbnail} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import Contacts from 'react-native-contacts';
import {Actions} from 'react-native-router-flux';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

/* Themes modules */
import theme from '../../themes/base-theme';
import baseStyle from '../../themes/base-styles';
import styles from './styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Map from '../inputs/Map';
import * as db from '../../helpers/db';
import HeaderContent from '../inputs/Header'
import FriendsInvite from '../inputs/friendsInvite'
import {WithEventSubscription} from '../misc/WithEventSubscription';
import {pushRoute, popRoute, showError} from '../../actions/login';
import {removeUser} from '../../actions/events';

import ActionFFButton from '../inputs/ActionFFButton';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const party = require('../../../images/party.jpg');
const blankphoto = require('../../../images/photo.png');

/* Component class */

class MemberList extends Component{

    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
          invited: [],
          going: [],
          loading:true,
          key: Math.random()
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

      sortArrayAsc(array,key){
    
      return array.sort(function(a,b){
        return b[key] < a[key] ? 1 :
               b[key] > a[key] ? -1  :
               0
      })
    }


    fillUsers(event){
        
        db.getUsersData(event.users)
            .then((users) => {
                console.log("users ". users)
                users = this.sortArrayAsc(users, 'givenName')
                let invited = _.filter(users, function(user){ return user.status === 'invited' || user.status ==='going' });
                let going = _.filter(users,{'status':'going'})
                this.setState({invited, going, loading:false, key: Math.random()});
            });
    }

    componentWillReceiveProps(nextProps, nextState){
        this.fillUsers(nextProps.event)
    }
    
    componentWillUpdate(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }

  renderImageSource(link){
      if (link)    
        return {uri: link};
      else
        return blankphoto;
    }

  renderRightButton(rowData){
    if(this.props.uid === this.props.event.info.owner.uid){
      if(this.props.uid === rowData.uid )
        return
      return(
        <ActionFFButton 
                  userName={rowData.givenName}
                  activeText={"Remove"}
                  inactiveText={'Add'}
                  onPress={(value) => {this.removeFromParty(rowData.uid) }}
                  active={true}
                  ctype='remove'
        />);
    }
    else if(this.props.uid === rowData.uid ){
      return
    }
    else{
     return(
        <ActionFFButton 
                  userName={rowData.givenName}
                  onPress={(value) => {this.removeFromParty(rowData.uid) }}
                  active={true}
                  ctype='remove'
        />); 
    }
  }

  removeFromParty(uid){
    this.props.removeUser(this.props.eventId,uid,'removed');
  }  

  _renderRow(rowData){
      return(
            <TouchableOpacity  >
          <View style={styles.profileRowView}>
            <Thumbnail style={styles.profileThumbnail} source={this.renderImageSource(rowData.thumbnail)} />
            
              <Text style={styles.profileRowText} >{rowData.givenName}</Text>
            
            {this.renderRightButton(rowData)}
          </View> 
        </TouchableOpacity>
        );
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: adjacentRowHighlighted ? 4 : 1,
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
          }}
        />
      );
    }

  _renderScene(props){
    
      const {invited, going} = this.state;
      dataArrays = {going: this.ds.cloneWithRows(going), invited: this.ds.cloneWithRows(invited) };
      
      let usersList = _.map(dataArrays, (v,k)=>
                
                <View style={{flex: 1}} key={k} tabLabel={_.capitalize(k)} >
                 <ListView
                    key={this.state.key}
                    style={{flex: 1}}
                    dataSource={dataArrays[k]}
                    renderRow={this._renderRow.bind(this)}
                    renderSeparator={this._renderSeparator}
                    initialListSize={1}
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                />
                </View>
            )
      return <ScrollableTabView
              renderTabBar={() => <DefaultTabBar textStyle={styles.tabText} style={{backgroundColor:'#5F7EFE'}} underlineStyle={{height: 2,backgroundColor:'#d3d3d3'}} />} >
              {usersList}
              
            </ScrollableTabView>;
      
  }
    

    render(){
        return(
        <Container theme={theme}>
            <Image source={glow2} style={baseStyle.container}>
                {this._renderScene(this.props)}
            </Image> 
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
  user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         resetRoute: (route) => dispatch(resetRoute(route)),
         showError:(msg, cb) => dispatch(showError(msg, cb)),
         removeUser:(event_id,user_id,value)=>dispatch(removeUser(event_id,user_id,value)),
    }
}

var listComp = connect(mapStateToDispatch, bindActions)(MemberList)
export default WithEventSubscription(listComp);
