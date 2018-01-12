
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import baseStyle from '../../themes/base-styles';

module.exports = {
  links: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#454545',
  },
  image:{
    flex: 1, 
    justifyContent: 'space-around',
    alignItems:'flex-start',
    paddingTop: 20,
  },
  listItem:{
    flex: 1,
    borderBottomWidth:1, 
    borderStyle:'solid', 
    borderColor:'#727272',
    height:75,
    justifyContent:'center'
  },

  bg:{
    backgroundColor:'#333333',
    height:deviceHeight,
    width:deviceWidth,
    marginLeft:30
  },
  text:{
     fontFamily:'worksans-regular',
     fontSize: 14,
     color:'#FFF'
  }
};
