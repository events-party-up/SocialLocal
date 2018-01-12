import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity,TouchableHighlight ,InteractionManager,TextInput ,ListView} from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title, Input, InputGroup, Left, Body} from 'native-base';
import { connect } from 'react-redux';
// import { actions } from 'react-native-navigation-redux-helpers';
import {Actions, DefaultRenderer} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import Spinner from '../inputs/Spinner';
import ActionFFButton from '../inputs/ActionFFButton';
import {syncToStore, showError, pushRoute, popRoute} from '../../actions/login';

/* Helper methods*/ 
import * as db from '../../helpers/db';
import * as search from '../../helpers/search';
import {locations} from '../../helpers/constants';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const logo  = require('../../../images/social-logo.png');
const nextScreen = require('../../../images/Next-Screen.png');
class Profile extends Component{
	
	constructor(props){
		super(props);
    this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1,s2) => s1 !== s2 
        });

		this.state ={
      loading: true,
      loaded: false,
	    dataSource: this.ds.cloneWithRows([]),
      fixedDataSource: [],
      searchText: '',
      key: Math.random()
		};
    this.invites={}
  }

  getUsers(){
    
        let userVal = [],
            suggestions = [];
        db.getBlockUserList(this.props.user)
            .then(blockedList => db.getAllUserIds().then(users => _.pickBy(users, (value, key) => !blockedList[key])))
            .then((suggestions) => this.setState({
                dataSource: this.ds.cloneWithRowsAndSections({suggestions}),
                fixedDataSource: {suggestions},
                loading:false
            })).catch((e) => console.log("ERROR here",e))
      }

  // just in case it is needed
  excludeFollowingPeople(users){
    let userFollowingPeople = _.get(this.props.user,'regUsers');

    if(userFollowingPeople){
      return { 'suggestios': _.filter(users.suggestios, (m)=> !userFollowingPeople[m.uid]) }
    }
    
    return users;
  }

  getUserImage(user){
    const {photo} = user;
    if(photo){
      return {uri: photo};
    }
    else{
      return blankphoto;
    }
  }

  setSearchText(event) {
    let searchText = event && event.nativeEvent.text;
    if(!event){
      searchText = this.state.searchText;
    }
    let searchResult = search.filterSearchData(this.state.fixedDataSource, searchText);

    this.setState({
       dataSource: this.ds.cloneWithRowsAndSections(searchResult),
       searchText: searchText,
       key: Math.random()
     });
  }

  onFollowButtonPress(id, value){
    let regUsers = Object.assign({}, this.props.user.regUsers, this.invites);
    regUsers[id] = value;
    this.invites[id]=value;

    this.props.syncToStore({regUsers});
    db.followUsers2(this.props.user, id, value); 
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.user !== this.props.user){
      // Previous search should maintain its state.
      this.setSearchText();
    }
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions(() => {
          this.setState({loading: true}, this.getUsers())
      })
  }

  getButton(id, name){
    if(id == this.props.user.uid)
        return null;
    let followings = _.get(this.props.user,'regUsers');
    followings = Object.assign({},followings, this.invites);
    let isFollowing = followings && followings[id]? true: false

    return(
        <ActionFFButton 
            userName={name}
            ctype='follow'
            onPress={(value) => this.onFollowButtonPress(id,value)}
            active={isFollowing}
        />
    )
  }

  userViewProfile(userRowData, loggedInUserId){
    if(loggedInUserId === userRowData.uid){
      Actions.popTo('Profile_screen');
    }
    else{
      Actions.viewProfile({friend: userRowData, isFriendsView: true});
    }
  }

	renderContent1(){
		return(
			<View style={{backgroundColor: '#dcdcdc',padding:5}} >
        <InputGroup style={styles.inviteSearch}>
          <Icon name="ios-search" style={styles.findPeopleSearchIcon} />
  				<Input placeholder="Search" 
            style={{marginTop:7,fontSize:14,textAlignVertical:'center'}}
            value={this.state.searchText}
            onChange={this.setSearchText.bind(this)}
          />
        </InputGroup>    
			</View>
		);
	}

	renderContent2(){
		return(
			<TouchableOpacity onPress = {() => { Actions.findPeoplePhone({user: this.props.user})}} >
   				<View style={styles.editOptionsTab}>
   					<Text style={styles.editOptionsTabText} >Invite friends to Socialvite</Text>
	          <Image style={styles.editOptionsTabIcon} source={nextScreen} />
   				</View>	
    		</TouchableOpacity>);
	}

	renderListView(){
        return ( 
            <ListView
              key={this.state.key}
              keyboardShouldPersistTaps="always"
              style={{flex: 1}}
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              renderSeparator={this._renderSeparator}
              renderSectionHeader={this._renderSectionHeader}
              initialListSize={15}
              pageSize={10}
              scrollRenderAheadDistance={30}
              removeClippedSubviews={true}
            />);
    }

	_renderRow(rowData){
    	return(
   			<TouchableOpacity onPress = {() => this.userViewProfile(rowData, this.props.user.uid)}>
          		<View style={styles.profileRowView}>
            		<Image style={styles.profileThumbnail} source={this.getUserImage(rowData)} />
            		<View style={{flex: 1}}>
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
	          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
	        }}
	      />
	    );
	}
	_renderSectionHeader(sectionData, category){
  	return(
    	<View style={baseStyle.divider}>
        	<Text style={ [{marginTop:7},baseStyle.dividerText]}>Friends on Socialvite</Text>
    	</View>
  	);
  }

	render(){
		return(
			<Container theme={theme}>
        <Image source={glow2} style={styles.container}>
        <Spinner visible={this.state.loading}/>
        <View style={{backgroundColor:'#dcdcdc'}} >
          {this.renderContent1()}
        </View>

        <View>
          {this.renderContent2()}
        </View>

        <View style={{backgroundColor: '#dcdcdc',height:1,}}>
        </View>

        <View style={{flex: 1}}>
    		  {!this.state.loading && this.renderListView()}
        </View>

      </Image>
  	</Container>
		);
	}
}

const mapStateToDispatch = (state) =>({
})

function bindActions(dispatch) {
    return {
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg)),
    }
}

export default connect(mapStateToDispatch, bindActions)(Profile)
