
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = {
  container: {
    flex: 1,
    width:null,
    height:null,
    backgroundColor: '#fff',
    justifyContent:'space-between'
    
  },
  containerDevice:{
    backgroundColor: '#fff',
    justifyContent:'space-between',
    width:deviceWidth,
    height:deviceHeight
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  bg: {
    flex: 1,
    justifyContent:'space-between',
    alignItems:'stretch',
    backgroundColor: '#FFF',
    padding:40
  },

  button:{
    width: deviceWidth*0.5,
    marginTop: 20,
    height: 40,
    alignSelf: 'center',
    /* Rectangle 3 Copy: */
    backgroundColor: '#77CAF1',
    borderRadius: 100,
    /* Continue: */
  },
  
  googleButton:{
      width: deviceWidth*0.5,
      marginTop: 20,
      height: 40
  },

  signup:{
    alignSelf: 'center',
    backgroundColor: 'black',
    marginBottom: 10 ,
    width: deviceWidth*0.5,
    height: 40
  },

  recoverButton:{
    alignSelf: 'center',
    marginBottom: 10 ,
    width: deviceWidth*0.5,
    height: 40
  },

  input:{
    flex:1
  },

  errorText:{
    fontSize: 10,
    fontStyle: 'italic',
    color: 'red'
  },

  modal: {
    alignItems: 'center',
    height: deviceHeight
  },

  space: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    width: deviceWidth*0.5
  },

  normalButton2:{
    backgroundColor: '#77CAF1',
    width:null,
    height:null,
    paddingTop:5,
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:10,
    alignSelf:'center'
  },

  normalButton:{
    backgroundColor: '#77CAF1',
    borderRadius: 100,
    width: deviceWidth*0.65,
    height:50,
    alignSelf:'center'
  },

  roundedButton: {
    /* Rectangle 3: */
    backgroundColor: '#77CAF1',
    borderRadius: 100,
    /* Sign In With Google: */
    
    width: deviceWidth*0.8,
    height:50,
    marginTop:15,
    alignSelf:'center'
    },

    buttonText:{
      fontFamily:'worksans-medium',
      fontSize: 14,  
      color: '#fff'
    },
    footer:{
      alignSelf:'center',
      marginTop: 15,
    },
    lastfoot:{
      marginTop: 54
    },
    conditionText:{
      fontSize:14,
      fontFamily:'System',
      color:'#333333'
    },
    logo:{
      marginTop:50,
      alignSelf:'flex-end'
    },
    header:{
      flex:1,
      alignSelf:'center',
      justifyContent:'space-between'
    },
    heading:{
      fontSize:50,
      fontFamily:'worksans-regular',
      fontWeight:'300'
    },
    lastfoottext:{
      fontSize:11,
      textDecorationStyle:'solid',
      textDecorationLine: 'underline',
      fontFamily:'worksans-regular',
      color:'#9B9B9B'
    },
    regulartext:{
      fontFamily:'worksans-regular',
      fontSize: 14,
      color:'#333333',
      textAlign:'center'
    },
    text:{
      fontFamily:'worksans-medium',
      fontSize: 14,
      color:'black'
    },
    line:{
      height:1,
      backgroundColor:'#B5B5B5'
    },
    sprogressbar:{
       flex: 1,
       width: deviceWidth,
       backgroundColor: '#77CAF1',
       height: 5
    },
    highglightText:{
      fontFamily:'worksans-regular',
      fontSize: 14,
      color:'#77CAF1',
      textAlign:'center'
    },
    activityIndicator:{
      position:'absolute',
      left: deviceWidth*0.5,
      top: deviceHeight*0.5
    },
    content:{
       flex: 1,
      justifyContent:'flex-start',
      alignItems:'stretch',
      backgroundColor: '#fff',
    },
    divider:{
      backgroundColor: '#F8F8F8', 
      height: 32, 
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle:'solid',
      borderColor:'#D7D7D7'
    },
    dividerText:{
      fontSize: 12, 
      marginLeft: 16,
      color: '#9B9B9B',
      fontFamily: 'System'
    },
    progressBar:{
      backgroundColor:'#5F7EFE',
      height:4,
    },
    touchMoreIcon:{
      alignItems:'flex-end',
      position:'absolute',
      top:-15,
      paddingRight:10,
      paddingLeft:20,
      right:-10,
    },
    profileRowText: {
    flex:1, 
    fontFamily: 'worksans-regular', 
    fontSize: 15,
    marginLeft: 10
  },

  profileRowSubText: {
    flex:1,
    fontFamily: 'worksans-regular',
    color:'grey', 
    fontSize: 15, 
    marginLeft: 10 
  },
};
