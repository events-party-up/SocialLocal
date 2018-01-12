
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;

module.exports = {
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  bg: {
    flex: 1,
    marginTop: (deviceHeight / 2) - 15,
    backgroundColor: '#00c497',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: (Platform.OS === 'ios') ? 70 : 50,
  },
  blankImageStyle: {
    width: 80, 
    height: 80, 
    borderRadius: 0, 
    alignSelf:'center', 
    marginBottom:5
  },
  uploadedImageStyle: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignSelf:'center', 
    marginBottom:5
  },
  conditionText:{
      fontSize:14,
      fontFamily:'worksans-regular',
      color:'#333333'
    }
};
