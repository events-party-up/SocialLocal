import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity,TouchableHighlight ,InteractionManager ,ListView} from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {Actions, DefaultRenderer} from 'react-native-router-flux';
import Communications from 'react-native-communications';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, popRoute,_signOut} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import {LIST_DATA_WITH_SECTIONS} from '../../helpers/constants';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const logo  = require('../../../images/social-logo.png');
const nextScreen = require('../../../images/Next-Screen.png');


/* Component class */

class EditOptions extends Component{

    constructor(props){
        super(props);
        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 ,sectionHeaderHasChanged: (s1,s2) => s1 !== s2 });
        this.state ={
          loading:true,
          dsource: ds.cloneWithRowsAndSections(this.convertMapFunc())
        }	
    }
    
      shouldComponentUpdate(nextProps,nextstate){
      if(nextProps.user === null)
        return false;
      return true;
    }
    pushRoute(route){
        this.props.pushRoute({ key: route})
    }

    popRoute(){
        this.props.popRoute();
    }

    convertMapFunc(){
      var category = {};
      LIST_DATA_WITH_SECTIONS.forEach(function(item){
        if(!category[item.section]){
          category[item.section] = [];
        }
        category[item.section].push(item);
      });
      return category;
    }
    
    
     _renderRow(rowData){
    	return(
   			<TouchableOpacity onPress={ ()=> { (rowData.key === 'feedback')? Communications.email(['p.anthony.arias@gmail.com'],null,null,"Support/feedback","") : this.props.pushRoute({key: rowData.key, user: this.props.user})} } >
          <View style={styles.editOptionsTab}>
            <Text style={styles.editOptionsTabText} >{rowData.name}</Text>
            <Image style={styles.editOptionsTabIcon} source={nextScreen} />
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
              	<Text style={[{ marginTop:8},baseStyle.dividerText]}>{category.toUpperCase()}</Text>
          	</View>
      	);
   	}

    render(){
          
      return(
            	<View style={{flex: 1}}>
              <ListView
                style={{flex:1}}
            		dataSource={this.state.dsource}
            		renderRow={this._renderRow.bind(this)}
            	  renderSeparator={this._renderSeparator}
            	  renderSectionHeader={this._renderSectionHeader}
            	/>
              <Button transparent style={{alignSelf:'flex-start',marginBottom: 20}} onPress={()=> this.props._signOut()} > 
              <Text style={{fontSize:14,fontFamily: 'worksans-medium' ,color:'#5F7EFE'}}> Log Out </Text></Button>
              </View>
         
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
        showError: (msg) => dispatch(showError(msg)),
        _signOut: () => dispatch(_signOut())

    }
}

export default connect(mapStateToDispatch, bindActions)(EditOptions)