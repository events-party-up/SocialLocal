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

class BlockedList extends Component{

    constructor(props){
      super(props);
      ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
      this.state = {
        loaded: false,
        dataSource: ds.cloneWithRows([]),
        isListEmpty: true
      };
    }

    updateBlockList(blockedUsers){
      blockedUsers = _.pickBy(blockedUsers, function(value, key) {
                       return value;
                       });
      let blocked = []
      let self = this;
      if (!_.isEmpty(blockedUsers)){
        InteractionManager.runAfterInteractions(() => {        
          _.forEach( blockedUsers,function(value,key){
              db.getUserByUid(key).then((data) => { 
                blocked.push(data)
                self.setState({loaded: true, isListEmpty: false, dataSource: ds.cloneWithRows(blocked)});
              });
          })

        })
      }
      else{
        this.setState({loaded: true,isListEmpty: true ,dataSource: ds.cloneWithRows([])});
      }  
    }  

    componentWillMount(){
        this.updateBlockList(this.props.user.blockedUsers);
    }

    componentWillReceiveProps(nextProps){
      this.updateBlockList(nextProps.user.blockedUsers)
   }

    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(route){
        this.props.popRoute();
    }



    renderContent1(){
      if(!this.state.loaded){
        return;
      }
      else{
        if(this.state.isListEmpty){
          return ( 
            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center',}}>
              <Text style={{fontSize: 14, fontFamily: 'worksans-regular'}}>No blocked users in the list</Text>
            </View>
          );
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
            </View>
          );
        }
      }
    }

    renderImageSource(link){
      if (link)    
        return {uri: link};
      
        return blankphoto;
    }
    
    onBlockButtonPress(id,value){

        // let regUsers = this.props.user
        blockFlag = value
        let blockedUsers = Object.assign({}, this.props.user.blockedUsers);

        blockedUsers[id] = false;
        
        this.props.syncToStore({blockedUsers});
        db.blockUser(this.props.user.uid,id,value) 
    }

    
    _renderRow(rowData){
      return(
        <TouchableOpacity  >
          <View style={styles.profileRowView}>
            <Thumbnail style={styles.profileThumbnail} source={this.renderImageSource(rowData.photo)} />
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

    render(){
        return(
                <Container>

                  <View style={{flex:1}}>
                    {this.renderContent1()}
                    </View>

                </Container>
        );
    }

  getButton(id, name){
    return(
      <ActionFFButton 
        userName={name}
        activeText='Unblock'
        inactiveText='Block'
        ctype='block'
        onPress={(value) => { this.onBlockButtonPress(id,value)}}
        active={true}
      />
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

export default connect(mapStateToDispatch, bindActions)(BlockedList)