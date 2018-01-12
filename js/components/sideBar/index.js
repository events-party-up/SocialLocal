
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Text, ListView, TouchableHighlight } from 'react-native';
import { Icon, List, ListItem, Content, Thumbnail, Badge } from 'native-base';
import { actions } from 'react-native-navigation-redux-helpers';

import styles from './style';

const logo = require('../../../images/social-logo.png');
import { _signOut} from '../../actions/login';
import navigateTo from '../../actions/sideBarNav';

const {
  pushRoute,
  replaceAt
} = actions;

class SideBar extends Component {

  static propTypes = {
    navigateTo: React.PropTypes.func,
  }

  static contextTypes = {
      drawer: React.PropTypes.object,
  }

  constructor(props, context){
    super(props, context);
    this.listItems=[
      {text:'Friends', callback: null},
      {text:'Settings', callback: null},
      {text:'Help', callback:null},
      {text:'Extra', callback: null}
    ]

    const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.listItems)
    }

    this.drawer = context.drawer;
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  logout(){
    //this.drawer.close();
    this.props._signOut();
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.user === null){
      return false;
    }
    return true;
  }

  getPhoto(photo){
    if(photo)
      return <Thumbnail size={80} 
      style={{resizeMode: 'cover' }}
       source={{uri: photo}} />
    else
      return null;
  }
  getUserName(){
    const {user} = this.props;
    if(!user)
      return null;
    let datas = [
      <Text key="name_1" style={styles.text}>{user.name.toUpperCase()}</Text>,
      <Text key="name_2" style={styles.text}>@ {user.username.toUpperCase()}</Text>
    ]
    return datas;
  }

  getThumbnail(){

    const photo = _.get(this.props, 'user.photo')
    
    return(
      <View style={styles.image}>
        {this.getPhoto(photo)}
        {this.getUserName()}
      </View>
  );

  }

  renderRow(data){
    return <View style={styles.listItem}>
      <Text style={styles.text}>{data.text}</Text>
     </View>
  }

  render() {
    if(this.props.user && this.props.user.name)
    return (
      <Content style={{ backgroundColor: '#333333' }} >
        <View style={styles.bg}>
          {this.getThumbnail()}
          <ListView
            style={{flex: 2}}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow} />
          <View style={{flex:1,justifyContent:'center'}}>
            <TouchableHighlight 
                style={{alignSelf:'stretch', paddingTop: 20, paddingBottom: 20}} 
                onPress={()=> this.logout()}>
              <Text style={styles.text}>Log out</Text>
            </TouchableHighlight>
          </View>
        </View>
        
      </Content>
    );
    else
      return null;
  }
}

function bindAction(dispatch) {
  return {
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    _signOut: () => dispatch(_signOut())
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.login.user
});


export default connect(mapStateToProps, bindAction)(SideBar);