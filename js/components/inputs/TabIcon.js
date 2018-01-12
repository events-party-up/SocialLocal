import React, {
  PropTypes,
} from 'react';
import {
  Text,
  View,
  Image
} from 'react-native';

/*** Others ****/
import {Icon,Thumbnail} from 'native-base'

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,

};

const TabIcon = (props) => {
  return <View style={styles.container}>
  	<Image small={props.largeIcon? false: true } large={props.largeIcon? true: false} 
    source={props.selected ? props.selectedIcon : props.unselectedIcon} />
  	
  </View>
}

TabIcon.propTypes = propTypes;

export default TabIcon;

const styles={
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f9f5f4'
  },
	selectedText:{
      fontFamily:'worksans-regular',
      fontSize: 11,
      color:'#007ef6',
      textAlign:'center'
    },
    unselectedText:{
      fontFamily:'worksans-regular',
      fontSize: 11,
      color:'#333333',
      textAlign:'center'
    },

}