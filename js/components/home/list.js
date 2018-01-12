import React, {Component} from 'react';

/* Open source modules */
import {View, ActivityIndicator, ListView, Image,TabBarIOS , ActionSheetIOS, NavigationExperimental, InteractionManager,ScrollView,TouchableOpacity} from 'react-native'
import { Container, Text , Content, Button, Header, Icon , Title,Card  } from 'native-base';
import { connect } from 'react-redux';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions, ActionConst, DefaultRenderer} from 'react-native-router-flux';
const Permissions = require('react-native-permissions');
import SGListView from 'react-native-sglistview';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import HeaderContent from '../inputs/Header';
import FormInput from '../inputs';
import Map from '../inputs/Map'
import AnimatedView from '../inputs/AnimatedView'
import {FirebaseToState, stateToFirebase } from '../../actions/listeners'
import Tabs from './tabs';
import BoxDrawer from '../inputs/boxdrawer'
import {resetRoute, pushRoute, popRoute, showError} from '../../actions/login';
import {addTime, onInvitationStatusChange,endParty} from '../../actions/events';
import {openDrawer} from '../../actions/drawer';
import * as db from '../../helpers/db';
import ListEventInfo from '../inputs/ListEventInfo';
import Spinner from '../inputs/Spinner';
import {WithSubscription} from '../misc/WithSubscription';
import {EMPTY_EVENT_LIST_TEXT} from '../../helpers/constants';

const glow2 = require('../../../images/glow2.png');
const logo  = require('../../../images/social-logo.png');
const globe  = require('../../../images/map-view.png');

class MyList extends Component{

    constructor(props){
      super(props);
      this.mount= true;

      this.state = {
        loading: true,
        dataSource:null,
        isListEmpty: true,
        key: 123
      }

      this.ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged:(s1, s2) => s1 !== s2
      });

      this.ownerDrawList = [

          {  icon: 'ios-clock-outline',
             text: 'Edit The Party',
             onClicked:((event)=> this.pushToEdit(event) )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Message',
             onClicked:((event)=> this.pushToMessage(event))
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Mute Notifications',
             onClicked:((event)=> db.pushToMute(event.id,this.props.uid,this.getMuteStatus(event)) )

             
            },
            {  icon: 'ios-clock-outline',
             text: 'End The Party',
             onClicked:((event)=> {db.finishParty(event.id);} )
             
            }
        ];

        this.invitedDrawList = [

          {  icon: 'ios-clock-outline',
             text: 'Join The Party',
             onClicked:((event)=> { props.onInvitationStatusChange({id: event.id},props.uid,!this.getGoingStatus(event)) } )
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Message',
             onClicked:((event)=> this.pushToMessage(event))
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Mute Notifications',
             onClicked:((event)=> db.pushToMute(event.id,this.props.uid,this.getMuteStatus(event)) )             
             
            },
            {  icon: 'ios-clock-outline',
             text: 'Remove From Feed',
             onClicked:((event)=> db.removeFromFeed(event.id,this.props.uid) )
             
            }
        ];   

    }

    mainNavigationWithoutMarker(route,event){
      this.props.pushRoute({ key: route, event: event,eventId: event.id,onOptionsPress: (event) => this.showActionSheet(event)});
    }

    pushToMessage(event){
        p = new Promise((resolve, reject) => {
        setTimeout(resolve, 10, 'foo');
      });
      p.then(()=> Actions.tab2({type:ActionConst.REFRESH}) )
      .then(()=>Actions.chat({group: event,type: ActionConst.PUSH,fromEvent:true}) )
    }

    renderRightNavbarButton(){
      return( <TouchableOpacity style={{padding:5}} onPress={()=> Actions.MapsMain({type: ActionConst.REPLACE, index: this.index, event: this.props.event, eventId: this.props.eventId}) }> 
                <Image source={globe} />
              </TouchableOpacity>
        );
      }  
     componentWillUnmount(){
      this.mount = false;
    }
    
    componentWillReceiveProps(nextProps){
      
      if(nextProps.isReady){
        const {markers, events} = nextProps;
        let a = this.filterEvents(markers);
        
        this.setState({dataSource: this.ds.cloneWithRowsAndSections(a),eventList:a, loading: false, key:Math.random(), markers, events})
      }
    }

    shouldComponentUpdate(nextProps, nextState){
      
        if(_.isEqual(nextProps.markers, this.state.markers))
          return false;
        else
          return true;
    }
    
    componentWillMount(){
      Actions.refresh({renderLeftButton: (()=>this.renderRightNavbarButton()) })
    }


    pushToEdit(event){
        
        this.props.pushRoute({ key: 'editParty', event, eventId: event.id })
    }

    getMuteStatus(event){
      return (event.users_muted && event.users_muted[this.props.uid] === 'muted')
    }

    showActionSheet(event){   
      //return this.props.resetRoute('landingpage');

      renderActionButtons = (this.props.uid === event.info.owner.uid )? this.ownerDrawList : this.invitedDrawList
      let buttons = _.map(renderActionButtons,(val) => val.text);
      if(this.props.uid !== event.info.owner.uid )
        buttons[0] =  (this.getGoingStatus(event))? "Leave The Party": "Join The Party"
      buttons[2] = (this.getMuteStatus(event))? "Unmute Notifications" : "Mute Notifications"
      buttons.push('Cancel');

      ActionSheetIOS.showActionSheetWithOptions({
        options: buttons,
        title:event.info.name,
        cancelButtonIndex: buttons.length-1
      },
        (buttonIndex)=>{
          // call the callback
          renderActionButtons[buttonIndex] && 
          renderActionButtons[buttonIndex].onClicked && 
          renderActionButtons[buttonIndex].onClicked(event)
        }
      )
    }

   
    getGoingStatus(event){
        const {uid} = this.props;
        if(event.users && event.users[uid] === 'going')
            return true;
        else
            return false;
    }
    isOwnedEvent(event){
        const  {uid} = this.props;
        return uid === event.info.owner.uid;
    }

    updateMarkers(){
      //TODO: add current latitude lonhogitude.
      const latitude = null
      const longitude = null
      
      db.getNearbyEvents2(latitude, longitude, this.props.uid)
        .then(({partyon, events}) => {
          a = this.filterEvents(partyon);
          this.mount && this.setState({dataSource: this.ds.cloneWithRowsAndSections(a),eventList:a, loading: true})
        })
    }

    filterEvents(partyon){
      if (partyon.length === 0)
        this.setState({isListEmpty: true});
      else
        this.setState({isListEmpty: false});

      const {uid} = this.props;
      retEvents =[]
      retEvents['my party on']=[]      
      retEvents['invited']=[]
      retEvents['attending']=[]
      let blockedUsers = Object.assign({}, this.props.user.blockedUsers);
      partyon.forEach(function(event){
        if(!blockedUsers[event.info.owner.uid]){
        if(event.users[uid] === 'going'){
          retEvents['attending'].push(event)
        }
        else if(uid === event.info.owner.uid){
          retEvents['my party on'].push(event)
        }
        else{
          retEvents['invited'].push(event)
        }
        }
      })

        return retEvents;

    }

      _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
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

  _renderRow(rowData, sectionID){
    return(
        <ListEventInfo
          key={rowData.id}
          event={rowData}
          eventId={rowData.id}
          uid={this.props.uid}
          onPress={(event)=>  this.mainNavigationWithoutMarker('mapinfo',event) }
          onAddTime={this.props.addTime.bind(this,rowData,1)}
          onCounTDownEnd={()=> {this.updateMarkers()} }
          onInvitationStatusChange={this.props.onInvitationStatusChange.bind(this,rowData,this.props.uid,!this.getGoingStatus(rowData))}
          onOptionsPress={(event)=>{ this.showActionSheet(event)} } 
          />
    )
  }

  _renderSectionHeader(sectionData, category){
    return(
        <View style={baseStyle.divider}>
            <Text style={baseStyle.dividerText}>{category.toUpperCase()}</Text>
        </View>
    );
  }

  renderContent1(){

      if(this.state.loading){
            return(
              <View style={{flex: 1}}>
                   <Spinner visible={this.state.loading}/>
              </View>
            );
      }
      else{
        return(
        <View style={{flex: 1,justifyContent:'center'}}>
          {this.state.isListEmpty ? 
            <Text style={{alignSelf:'center',padding:50,textAlign:'center',justifyContent:'center', fontSize: 14, fontFamily: 'worksans-regular'}} >{EMPTY_EVENT_LIST_TEXT}</Text> : this.getAllList()
         }
        </View>
        );
      }

    // return(
    //   <View style={{flex: 1}}>
    //     {!this.state.loading ? 
    //        <Spinner visible={!this.state.loading}/> : this.getAllList()
    //     }
    //   </View>
    // );
  }

  getAllList(){
    return(
    <ScrollView style={{flex: 1}}>
    {this.getListViews(this.state.eventList['my party on'],'my party on')}
    {this.getListViews(this.state.eventList['attending'],'attending')}
    {this.getListViews(this.state.eventList['invited'],'invited') }
    </ScrollView>
    );
  }

  getListViews(data,headerTitle){
    if(data.length == 0)
      return
    return(<Content>
            <View style={baseStyle.divider}>
              <Text style={baseStyle.dividerText}>{headerTitle.toUpperCase()}</Text>
            </View>
          <ListView
            key={this.state.key}
            style={{flex:1}}
            dataSource={this.ds.cloneWithRows(data)}
            renderRow={this._renderRow.bind(this)}
            onEndReachedThreshold={1}
            scrollRenderAheadDistance={20}
            pageSize={1}
            initialListSize={5}
            automaticallyAdjustContentInsets = { false }
        />
        </Content>);
  }

  render(){
    return(
        <Container theme={theme}>
              <View style={{flex:1,justifyContent:'flex-end'}}> 
                  {this.renderContent1()}
              </View>
        </Container>
    );
  }
}


const mapStateToDispatch = (state) =>({
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         showError: (msg, cb) => dispatch(showError(msg, cb)),
         reset: (routes, key, index) => dispatch(reset(routes, key, index)),
         updateEvent:(msg)=> dispatch(updateEvent(msg)),
         addTime:(event,time)=>dispatch(addTime(event,time)),
         endParty:(event_id)=> dispatch(endParty(event_id)),
         onInvitationStatusChange:(event,uid,status)=> dispatch(onInvitationStatusChange(event,uid,status))
    }
}

//export default connect(mapStateToDispatch, bindActions)(MyList)


var home = connect(mapStateToDispatch, bindActions)(MyList);
//export default home;
export default WithSubscription(home);
