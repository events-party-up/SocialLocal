
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = {
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: '#fff',
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  bg: {
    flex: 1,
    marginTop: 40 ,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: (Platform.OS === 'ios') ? 70 : 50,
  },

  button:{
    width: deviceWidth*0.5,
    marginTop: 20,
    height: 40,
    alignSelf: 'center'
  },

  view:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  circle:{
    width: 200,
    height: 200,
    borderRadius: 200/2,
    backgroundColor: 'gray',
  }
};
