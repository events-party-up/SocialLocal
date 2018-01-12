import React, {Component} from 'react';

/* Open source modules */
import {View, Image, AlertIOS, TouchableOpacity, LayoutAnimation, InteractionManager, ListView,ActionSheetIOS } from 'react-native'
import { Container, Text, Tabs, Content, Button, Tab, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {Actions, DefaultRenderer, ActionConst} from 'react-native-router-flux';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import RNFetchBlob from 'react-native-fetch-blob';


/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, popRoute} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import {locations} from '../../helpers/constants';
import ActionFFButton from '../inputs/ActionFFButton';
import {SubscribeUser} from '../misc/SubscribeUser';


const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/AddPhoto.png');
const logo  = require('../../../images/social-logo.png');
const findPeopleIcon = require('../../../images/find-people.png')

const testToken = ["cBaTbmYqvqg:APA91bETSl0RTSIeBcpAaZmjgvSjM5oslmmSnKolhM7_K6ajBrqbByNvwkr_4e0FZr7rWbLlAObf3Gk1hDo8iRLOZIp44Cm5njspWmG9RrTc0JaVuTvMssnB1cCuUDXU1Mx_9C08Uy2g"];

/* Component class */

class Profile extends Component{

    static PropTypes ={
        showInformation: React.PropTypes.object.isRequired,
        isFriendsView: React.PropTypes.bool.isRequired
    }

    constructor(props){
        super(props);
        let userData = this.loadUser(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
        
        const {showInformation, isFriendsView} = this.props;
        showInformation["mutual"]= isFriendsView ? true : false
        
        this.state ={
          ...userData,
          loading:true,
          currentTab:'following',
          dataArrays:{  "following":[],
                        "followers":[],
                        "mutual"  :[]
                    },
          showInformation,
          blockedUsers: [],
          key: Math.random()
        }
        this.drawList = [

          {  icon: 'ios-clock-outline',
             text: 'Block',
             onClicked: (()=> this.blockUser())
             
            },
        ]   
    }

    static defaultProps ={
        isFriendsView: false,
        showInformation: {
            "following": true,
            "followers": true,
            "mutual"  : false
        }
    }

    loadUser(props){
      const{user, friend} = props;
      let userData = props.isFriendsView ? friend: user;
      const {name, username, about, photo, city} = userData;

      if(photo){
        return {
          ...userData,
          avatarSource:{uri: photo}
        }
      }
      else{
          return{
              ...userData,
              avatarSource: blankphoto
          }
      }
    }

    updateFollowersFollowingOf(uid){
        
        InteractionManager.runAfterInteractions(() => {
                db.getFollowerFollowingCountOf(uid)
                .then(({followers, following}) => {
                    let mutuals= this.filterMutual(following);
                    this.getBlockedUsers(following, followers, mutuals);
                })
        })
    }

    
    showActionSheet(){
      
      //return this.props.resetRoute('landingpage');
      let buttons = _.map(this.drawList,(val) => val.text);
      buttons.push('Cancel');

      ActionSheetIOS.showActionSheetWithOptions({
        options: buttons,
        cancelButtonIndex: buttons.length-1
      },
        (buttonIndex)=>{
          // call the callback
          this.drawList[buttonIndex] && 
          this.drawList[buttonIndex].onClicked && 
          this.drawList[buttonIndex].onClicked()
        }
      )
    }

    sortArrayAsc(array,key){
      return array.sort(function(a,b){
        return b.name < a.name ? 1 :
               b.name > a.name ? -1  :
               0
      })
    }

    blockUser(){
      let blockedUsers = Object.assign({}, this.props.user.blockedUsers);
      blockedUsers[this.props.friend.uid] = true;
      this.props.syncToStore({blockedUsers});
      db.blockUser(this.props.user.uid,this.props.friend.uid,true)
      Actions.pop()
    }

    filterMutual(followers){
      
      let userFollowingPeople = _.get(this.props.user,'regUsers');
      
      if(userFollowingPeople)
        return _.filter(followers,(m)=> userFollowingPeople[m.uid])
      else
        return []
    }

    getBlockedUsers(following, followers, mutuals){
      let blockedUsers = Object.assign({}, _.get(this.props.user,'blockedUsers'));
      let friendBlockedUsers = Object.assign({}, _.get(this.props.friend,'blockedUsers'));
      let blockedList = Object.assign({});

      blockedUsers = _.pickBy(blockedUsers, function(value, key) {
                       return value;
                       });
      friendBlockedUsers = _.pickBy(friendBlockedUsers, function(value, key) {
                       return value;
                       });
      db.getBlockedBy(this.props.user.uid).then((data) => {
        data = _.pickBy(data, function(value, key) {
                       return value;
                       });

        blockedList = _.merge(blockedUsers, friendBlockedUsers, data);
        // sort the list here
        following = this.sortArrayAsc(following,'name');
        followers = this.sortArrayAsc(followers, 'name');
        mutuals   = this.sortArrayAsc(mutuals, 'name');

        let dataArrays={
            "following": this.ds.cloneWithRows(this.filterBlocked1(following, blockedList)),
            "followers": this.ds.cloneWithRows(this.filterBlocked1(followers, blockedList)),
            "mutual"   : this.ds.cloneWithRows(this.filterBlocked1(mutuals, blockedList)),
        }
        this.setState({loading: false, dataArrays, key:Math.random() })
      });

      
      return blockedList;
    }

    filterBlocked1(usersList, blockedList){
      return _.filter(usersList, (m) => !blockedList[m.uid]);
    }

    renderRightNavbarIcon(){
      
      return this.props.isFriendsView ? 
        <Icon
          name='ios-more'
          onPress={this.showActionSheet.bind(this)}
          style={styles.navbarRightIcon}
        />
        : 
        <Icon
          name='ios-settings-outline'
          onPress={ ()=> Actions.editOptions()}
          style={styles.navbarRightIcon}
        />
    }

    renderLeftNavbarIcon(){
          
      
      return( <TouchableOpacity style={{flex:1 }} onPress={()=> {Actions.findPeople({type: ActionConst.PUSH, user: this.props.user}) } } > 
                <Image source={findPeopleIcon} style={styles.navbarLetIcon}/>
              </TouchableOpacity>
        );
    }

    componentDidMount(){
      
      Actions.refresh({
        renderLeftButton: ()=>this.renderLeftNavbarIcon() ,
        title: this.state.name ,         
        renderRightButton: ()=>this.renderRightNavbarIcon()
      })
      
    }

    componentWillMount(){
        // check if photoURL is present in database
        
        //if (this.props.isFriendsView)
          
          InteractionManager.runAfterInteractions(() => {
            //this.setState({isReady: false })
            this.updateFollowersFollowingOf(this.state.uid);
        })
          
    }


    shouldComponentUpdate(nextProps,nextstate){
      
      if(nextProps.user == null || nextProps.user.fcmToken == null)
        return false;
      return true;
    }

    componentWillReceiveProps(nextProps){
      // here we can't check nextProps.user and this.props.user since
      // it won't change if someone tries to follow / unfollow you.
      
      if (nextProps.isReady){
        let userData = this.loadUser(nextProps);
        this.updateFollowersFollowingOf(userData.uid);
        this.setState({...userData, key: Math.random()});
      }
    }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(route){
        this.props.popRoute();
    }

    renderContent1(){

        return(
        <View>
            <Image source={this.state.avatarSource} style={{alignSelf:'center',width:80,height:80,borderRadius:40 ,marginBottom:10,marginTop:26}} />
            <Text style={_.assign({},baseStyle.text,{fontSize:16,textAlign:'center'})}>{this.state.name}</Text>
            <Text style={_.assign({},baseStyle.regulartext,{fontSize:12,marginTop:1})}>{this.state.city}</Text>
            <Text style={_.assign({},baseStyle.regulartext,{fontSize:12,marginTop:10})}>{this.state.about}</Text>
            {this.getProfileButtons()}
        </View>
        );
    }

    renderImageSource(link){
      if (!link)    
      return blankphoto;
      else
        return {uri: link};
    }

    onFollowButtonPress(id,value){

        // let regUsers = this.props.user
        let regUsers = Object.assign({}, this.props.user.regUsers);

        regUsers[id] = value;
        
        this.props.syncToStore({regUsers});
        db.followUsers2(this.props.user,id,value); 
        //db.sendNotification(testToken,"title","Message");
    }

    sendNotification(){
      var s = 'https://fcm.googleapis.com/fcm/send';
      fetch(s, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'key=AAAA4FrVHD0:APA91bHZPiJZpG2ZdKrdbq9vJvGRo6VnQn0Jwm7i9SJuiCulvefC2j-0zVnAsXHk50-VJ1tY6aNf391lvt3Ml8Mc1EMrStBrdy3RgsBgszsh7P_85kHGq_Y9A-_vV5xTi8e2sdiwZ-UK'
        },
        body: JSON.stringify({
          "registration_ids":["fCC5srZJDMI:APA91bGVlTE7P-KRY5sW455WqDNH9r6QLEPbZZ8CNm5mNV4wv5O7_CbEWxHKb3YhctTYqZK57rkOPap53WNBjK4eXRqWbvQKsa9D16zf8ROpwKrAyURM3vW0fyQx6-fv9dtr3B5bqupP",],
          "notification" : {
             "body" : "Bink Katal has started following you",
             "title": "",
             "sound": "default",
             "key": "hello1",
           },
          "data" : { "kkey":"value"},
        })
      })
      .then((response) =>{} )
      .catch((e) =>{} );
    }

    onMessageButtonClicked(){
      AlertIOS.alert('Message', 
                     'We’re sorry, direct messaging is not yet available. Stay tuned.',
                     [{text: 'Ok', onPress: ()=>{}},
                 ])
    }

    getProfileButtons(){
      if (this.props.isFriendsView && this.props.friend !== undefined ){
        return(
             <View style={styles.profileButtonsView}>

              {this.getButton(this.props.friend.uid , this.props.friend.name,{width:140,height:40,marginRight:7})}
                
               <Button primary rounded onPress={this.onMessageButtonClicked}
                  style={_.assign({},styles.solidButton,{width:140,height:40,marginLeft:7,justifyContent:'center'})} >
                 <Text style={styles.messageButtonText} > Message </Text>
               </Button>

             </View>
           );
      }
        else
          return;
    }

    getButton(id, name,btnStyle){
        if(id === this.props.user.uid)
            return null;
        let followings =  Object.keys(this.props.user).includes('regUsers') ? _.get(this.props.user,'regUsers') : [] ;
        let isFollowing = followings[id]? true: false
        return(
            <ActionFFButton
                style={btnStyle} 
                userName={name}
                onPress={(value) => { this.onFollowButtonPress(id,value)}}
                active={isFollowing}
                ctype='follow'
            />
        )
    }

    onRowPress(rowData){
        const {user} = this.props;
        if(user.uid === rowData.uid){
            Actions.popTo('Profile_screen');
        }
        else{
            Actions.viewProfile({friend: rowData, isFriendsView: true});
        }
    }

    _renderRow(rowData){
      return(
            <TouchableOpacity onPress = {() => this.onRowPress(rowData)} >
              <View style={styles.profileRowView}>
                <Thumbnail style={styles.profileThumbnail} source={this.renderImageSource(rowData.photo)} />
                <View style={{flex: 1,marginLeft:2}}>
                  <Text style={styles.profileRowText} >{rowData.name}</Text>
                  <Text style={styles.profileRowSubText} >{rowData.username}</Text>
                </View>
                {this.getButton(rowData.uid,rowData.name)}
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
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'
          }}
        />
      );
    }

    renderContent2(){
        const {dataArrays, currentTab} = this.state;
        const {showInformation} = this.state;
        showInformation["mutual"]= this.props.isFriendsView ? true : false
        let usersList = _.map(dataArrays, (v,k)=>
                showInformation[k] &&
                <View style={{flex: 1,}} key={k+this.state.key} tabLabel={_.capitalize(k)}>
                 <ListView
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
                      renderTabBar={() => <DefaultTabBar textStyle={styles.tabText} underlineStyle={{height: 2,backgroundColor:'#5F7EFE'}}  />} >
                      {usersList}
                    </ScrollableTabView>;
    }

    render(){
        // render Datasource array based on currentTab
        
        return(
        <Container theme={theme}>
                <View style={styles.bg} keyboardShouldPersistTaps="always">
                    <Spinner visible={this.state.loading}/>
                    <View>
                       {this.renderContent1()}
                    </View>
                    <View style={{flex: 1,alignSelf: 'center',marginTop:15}}>
                      <View style={{backgroundColor:'#B2B2B2',height:0.5}} ></View>
                       {!this.state.loading && this.renderContent2()}
                    </View>
                </View>
        </Container>
        );
    }
}


const mapStateToDispatch = (state) =>({
  user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route, key) => dispatch(pushRoute(route, key)),
         popRoute: (key) => dispatch(popRoute(key)),
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg))
    }
}

//export default connect(mapStateToDispatch, bindActions)(Profile)

var UserProfile = connect(mapStateToDispatch, bindActions)(Profile)
export default SubscribeUser(UserProfile);
