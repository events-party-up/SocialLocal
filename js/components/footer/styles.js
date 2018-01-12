

const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const width = Dimensions.get('window').width;

module.exports = {
  footer: {
    // flex: 1,
    width,
    flexDirection: 'row',
    height: 55,
    borderWidth: 0,
    alignSelf: 'stretch',

    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  button:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center'
  },

  fgColor:{
    backgroundColor: '#fff'
  },

  bgColor:{
    backgroundColor: 'rgba(0,0,255,0.2)'
  }
};
