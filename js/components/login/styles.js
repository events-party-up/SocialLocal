
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const aspectRatio = deviceHeight / deviceWidth
if(aspectRatio > 1.6){
  // code for Iphone
  ipad = false
}else{
  ipad = true
  // code for IPAD
}

module.exports = {
  container: {
    flex: 1,
    width:null,
    height:null,
    flexDirection:'column',
    backgroundColor: '#fff',
    justifyContent:'space-between'
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  bg: {
    flex: 0.8,
    justifyContent:'flex-start',
    alignItems:'stretch',
    backgroundColor: '#fff',
    padding:40,
    paddingTop:60
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

  normalButton:{
    backgroundColor: '#5F7EFE',
    borderRadius: 100,
    width: deviceWidth*0.65,
    height:50,
    alignSelf:'center',
    justifyContent: 'center'
  },

  roundedButton: {
    /* Rectangle 3: */
    backgroundColor: '#5F7EFE',
    borderRadius: 100,
    maxWidth: 300,
    /* Sign In With Google: */
    
    width: deviceWidth*0.8,
    height:40,
    marginTop:15,
    alignSelf:'center',
    justifyContent: 'center'
    },

    buttonText:{
      fontFamily:'worksans-medium',
      fontSize: 12,  
      color: '#fff',
    },
    footer:{
      alignSelf:'center',
      marginTop: 15,
    },
    lastfoot:{
      marginTop: ipad? 20: 54,
      alignSelf:'center'
    },
    lastfoot1:{
      marginTop: 14,
      alignSelf:'center'
    },
    conditionText:{
      fontSize:12,
      fontFamily:'worksans-regular',
      color:'#333333'
    },
    logo:{
      marginTop: ipad? 20: 100,
      alignSelf:'center'
    },
    header:{
      alignSelf:'center',
      
    },
    heading1:{
      fontSize:20,
      fontFamily:'worksans-regular',
      fontWeight:'400',
      justifyContent:'center',
      textAlign:'left',
      color: '#333333',
      textDecorationLine:'underline'
    },
    heading:{
      fontSize:30,
      fontFamily:'worksans-medium',
      fontWeight:'400',
      justifyContent:'center',
      textAlign:'center',
      color: '#333333',
      
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
      color:'black'
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
    blueButton:{
      backgroundColor:'#5F7EFE',
      width: deviceWidth*0.5,
      marginTop: 20,
      height: 40,
      alignSelf: 'center',
      borderRadius: 100,
    },
    forgetPasswordText:{
      alignSelf:'center',
      width: 300,
      textAlign: 'center',
      fontFamily:'worksans-regular',
      fontSize: 12,
      paddingLeft:30,
      paddingRight:30,
      paddingTop:20,
      paddingBottom:20
    },
    checkbox:{
      width: 15,
      height:15,
      marginRight: 10
    },
    splashScreen:{
      width: deviceWidth,
      height: deviceHeight,
      flex: 1,
      
    }
};
