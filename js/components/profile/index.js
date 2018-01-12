import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity, InteractionManager,ListView } from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import {Actions, ActionConst ,DefaultRenderer} from 'react-native-router-flux';

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


const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const logo  = require('../../../images/social-logo.png');


/* Component class */

class Profile extends Component{

    constructor(props){
      super(props);
      ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
      let userData = (this.props.userData == undefined) ? this.loadUser(this.props.user) : this.loadUser(this.props.userData);
      this.state = {
        // Followers profile view data
        ...userData,
        loggedInUser: this.props.user,
        profileUser: this.props.userData,
        followers:[],
        following:[],
        mutuals:[],
        fields: [],
        loading: true,
        ds: ds,
        dataSource: ds.cloneWithRows(['dark knight']),
        followTab: false,
        followingTab:true,
        mutualTab: false
      };


      InteractionManager.runAfterInteractions(() => {
                db.getFollowerFollowingCountOf(this.state.uid)
                .then(({followers, following }) => {
                  // this.state.followers = followers;
                  // this.state.following = following;
                  // this.state.loading = false;
                  // this.state.dataSource = ds.cloneWithRows(followers);
                  //this.setState({followers, following, loading: false, dataSource: ds.cloneWithRows(followers)});
                  //this.populateMutualFollowings();
                  var arr= this.filterMutual(following);
                  this.setState({followers, following, mutuals: arr, loading: false, dataSource: ds.cloneWithRows(following)
                  });
                })
                .catch(err => { this.setState({loading: false})  })
        })

      //db.getFollowerFollowingCountOf(this.state.uid)
        //    .then(({followers, following }) => this.setState({followers,following,loading:false,dataSource: ds.cloneWithRows(followers)}))
      
  }


    loadUser(user){
      const {name, username, about, photo, city , uid} = user;
      let userData = {
          name,
          username,
          about,
          city,
          uid,
      }

      if(photo){
        return {
          ...userData,
          avatarSource:{uri: photo}
        }
      }
      else{
        return {
          ...userData,avatarSource: logo
        }
      }
      return userData;
    }

    componentWillReceiveProps(nextProps){

      let userData = (this.props.userData === undefined )? this.loadUser(nextProps.user) : this.loadUser(nextProps.userData) ;
      if(nextProps.user !== this.state.loggedInUser)
        InteractionManager.runAfterInteractions(() => {
                db.getFollowerFollowingCountOf(this.state.uid)
                .then(({followers, following }) => {
                  var arr= this.filterMutual(following);
                  var dataArray = [];
                  if (this.state.followingTab)
                    dataArray = following;
                  else if (this.state.followTab)
                    dataArray = followers;
                  else
                    dataArray = arr;
                  this.setState({followers, following, mutuals: arr, loading: false, dataSource: ds.cloneWithRows(dataArray)
                  });
                })
                .catch(err => { this.setState({loading: false}) })
        })
        this.setState({...userData})
    }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(route){
        this.props.popRoute();
    }

    filterMutual(followers){
      let mutual = [];
      userFollowingPeople = Object.keys(this.state.loggedInUser).includes('regUsers')?  Object.keys(this.state.loggedInUser.regUsers) : null

      if (userFollowingPeople === null)
        return mutual;
      followers.forEach(function(m){
        if( m !== null && userFollowingPeople.includes(m.uid)){
          mutual.push(m)  
        }
         
      });

      return mutual;
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
             "body" : "hello! lets go to party tonight!",
             "title": "Vinay Kumar",
             "sound": "default",
             "key": "hello1",
           },
          "data" : { "kkey":"value"},
        })
      })
      .then((response) =>{console.log('Message sucesss',response)} )
      .catch((e) =>{console.log('Message failed',e)} );
    }
    renderContent1(){

        return(
        <View style={{...baseStyle.bg,...{padding:20}}}>
            <Thumbnail size={80} source={this.state.avatarSource} style={{alignSelf:'center', marginBottom:20}} />
            <Text style={{...baseStyle.text,...{fontSize:18,textAlign:'center'}}}>{this.state.name}</Text>
            <Text style={{...baseStyle.regulartext,...{fontSize:14}}}>{this.state.city}</Text>
            <Text style={{...baseStyle.regulartext,...{fontSize:11}}}>{this.state.about}</Text>
            
        </View>
        );
    }

    renderContent3(){
      if(this.state.loading){
        return(<View></View>);
      }
      else{
        return ( 
          <View style={{flex: 1}}>
            <ListView
              style={{flex: 1}}
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              renderSeparator={this._renderSeparator}
            />
          </View>);
      }
    }

    tabToggle(tabswitch,ds){

      //ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
       dataSource = this.state.ds.cloneWithRows(tabswitch);
       this.setState({dataSource: dataSource});
       this.setState({dataSource: dataSource});
    }

    renderImageSource(link){
      if (link === "")    
      return logo;
      else
        return {uri: link};
    }
    renderContent2(){
      if(this.props.notUser){
        return(
          
          <View style={styles.border}>
                <TouchableOpacity onPress = {()=> {this.tabToggle(this.state.following,this.state.ds); this.setState({followTab: false, followingTab: true,mutualTab: false})} } style={this.state.followingTab ? styles.tabSelected : styles.tabUnSelected}>
                 <Text>{this.state.following.length}</Text>
                 <Text style={styles.tabText}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress = {()=> {this.tabToggle(this.state.followers,this.state.ds); this.setState({followTab: true,followingTab: false,mutualTab: false})} } style={this.state.followTab ? styles.tabSelected : styles.tabUnSelected}>
                  <Text>{this.state.followers.length}</Text>
                  <Text style={styles.tabText}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {()=> {this.tabToggle(this.state.mutuals,this.state.ds); this.setState({followTab: false, followingTab: false ,mutualTab: true})} } style={this.state.mutualTab ? styles.tabSelected : styles.tabUnSelected}>
                  <Text>{this.state.mutuals.length}</Text>
                  <Text style={styles.tabText}>Mutuals</Text>
                </TouchableOpacity>
          </View>
          
        );
      }
      else{
       return(
          
          <View style={styles.border}>
                <TouchableOpacity onPress = {()=> {this.tabToggle(this.state.following,this.state.ds); this.setState({followTab: false, followingTab:true, mutualTab: false})} } style={this.state.followingTab ? styles.tabSelected : styles.tabUnSelected}>
                 <Text>{this.state.following.length}</Text>
                 <Text style={baseStyle.regulartext}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress = {()=> {this.tabToggle(this.state.followers,this.state.ds); this.setState({followTab: true, followingTab:false, mutualTab: false})} } style={this.state.followTab ? styles.tabSelected : styles.tabUnSelected}>
                  <Text>{this.state.followers.length}</Text>
                  <Text style={baseStyle.regulartext}>Followers</Text>
                </TouchableOpacity>
          </View>
          
        ); 
      }
    }

    renderFollowMessageButtons(){
      if (this.props.notUser){
        // if( Object.keys(this.state.loggedInUser).includes('regUsers') && Object.keys(this.state.loggedInUser.regUsers).includes(this.state.uid)){
        //   return(
        //     <View style={{flex: 1,flexDirection: 'row',padding: 20 }}>

        //       <Button primary rounded style={styles.solidButton} >
        //         <Text style={{color: 'white'}}> Following </Text>
        //       </Button>

        //       <Button primary rounded style={styles.solidButton} >
        //         <Text style={{color: 'white'}} > Message </Text>
        //       </Button>

        //     </View>
        //   );
        // }
        // else{
        //   return(
        //     <View style={{flex: 1,flexDirection: 'row',padding: 20 }}>

        //       <Button  rounded style={styles.hollowButton} >
        //         <Text style={{color: '#5F7EFE'}}> Follow </Text>
        //       </Button>

        //       <Button primary rounded style={styles.solidButton} >
        //         <Text style={{color: 'white'}} > Message </Text>
        //       </Button>

        //     </View>
        //   );
        // }
        let isFollowing = (Object.keys(this.state.loggedInUser).includes('regUsers') && Object.keys(this.state.loggedInUser.regUsers).includes(this.state.uid));
        return(
             <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center',paddingBottom: 5 }}>

                <ActionFFButton
                    userName={this.state.name} 
                    onPress={(value) => { 
                      if (value){
                        let user =this.state.loggedInUser
                        if(!Object.keys(this.state.loggedInUser).includes("regUsers"))
                          user["regUsers"] = [];
                        let regUsers = user.regUsers;
                        regUsers[this.state.uid] = true;
                      
                        this.props.syncToStore(user);
                      db.followUsers(this.state.loggedInUser.uid,this.state.uid,value);
                      }
                      else{
                        
                        let user = this.state.loggedInUser;

                        let regUsers = this.state.loggedInUser["regUsers"];

                        delete regUsers[this.state.uid];
                        user["regUser"] = regUsers
                        let valuesync = this.props.syncToStore({user});
                      db.followUsers(this.state.loggedInUser.uid,this.state.uid,value);
                      }
                      this.sendNotification() 
                    }}
                    active={isFollowing}
                />

               <Button primary rounded style={styles.solidButton} >
                 <Text style={{color: '#FFF',fontSize: 12,fontFamily:'worksans-medium',alignSelf:'center'}} > Message </Text>
               </Button>

             </View>
           );

      }
        else
          return;

    }

    getButton(id,name){


       if(this.state.loggedInUser.uid === id ){
         return(<View></View>);
       }
      // else if(this.state.loggedInUser.uid !== id &&  Object.keys(this.state.loggedInUser).includes('regUsers') && this.state.loggedInUser.regUsers[id] === undefined  ){
      //   return(
      //     <Button  rounded style={styles.hollowButton} >
      //       <Text style={{color: '#5F7EFE'}} > Follow </Text>
      //     </Button>
      //   );
      // }
      // else{
      //   return(
      //     <Button primary rounded style={styles.solidButton} >
      //       <Text style={{color: 'white'}} > Following </Text>
      //     </Button>
      //   );
      // }
        else{
          let isFollowing = (this.state.loggedInUser.uid !== id &&  Object.keys(this.state.loggedInUser).includes('regUsers') && Object.keys(this.state.loggedInUser.regUsers).includes(id)  ) 
          
          return(
            <ActionFFButton 
                   userName={name}
                   onPress={(value) => { 
                      if (value){
                        let user =this.state.loggedInUser
                        if(!Object.keys(this.state.loggedInUser).includes("regUsers"))
                          user["regUsers"] = [];
                        let regUsers = user.regUsers;
                        regUsers[id] = true;
                      
                        this.props.syncToStore(user);
                        db.followUsers(this.state.loggedInUser.uid,id,value) 
                      }
                      else{
                        
                        let user = this.state.loggedInUser;

                        let regUsers = this.state.loggedInUser["regUsers"];

                        delete regUsers[id];
                        user["regUser"] = regUsers
                        let valuesync = this.props.syncToStore({user});
                        db.followUsers(this.state.loggedInUser.uid,id,value) 
                      }
                      //db.followUsers(this.state.loggedInUser.uid,id,value) 
                    }}
                    active={isFollowing}
            />
          );
        }


    }

    _renderRow(rowData){
      return(
        <TouchableOpacity onPress = {() => { ( this.state.loggedInUser.uid === rowData.uid ) ?  Actions.popTo('Profile_screen')
 : Actions.viewProfile({notUser: true , userData: rowData })  }} >
          <View style={{flex:1,flexDirection: 'row' ,padding: 10 ,alignItems: 'center'}}>
            <Thumbnail style={{width:40,height:40,borderColor: 'black',borderRadius: 20,borderWidth:0.5}} source={this.renderImageSource(rowData.photo)} />
            <View style={{flex: 1}}>
              <Text style={{ flex:1, fontFamily: 'Cochin', fontSize: 15, marginLeft: 10, }} >{rowData.name}</Text>
              <Text style={{flex:1,fontFamily: 'Cochin',color:'grey' , fontSize: 13, marginLeft: 10 }} >{rowData.username}</Text>
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
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
          }}
        />
      );
    }

    render(){
        return(
        <Container theme={theme}>
                <Content style={{backgroundColor:'#FFF'}} keyboardShouldPersistTaps="always">
                <Image source={glow2} style={baseStyle.containerDevice}>
                    <Spinner visible={this.state.loading}/>
                    <View style={{flex:1,backgroundColor:'red',justifyContent:'flex-end'}}>
                       {this.renderContent1()}
                    </View>
                    
                    <View style={{flex: 2, justifyContent:'flex-end'}}>
                        {this.renderContent2()}
                        {this.renderContent3()}
                    </View>
                </Image>
                </Content>
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

export default connect(mapStateToDispatch, bindActions)(Profile)