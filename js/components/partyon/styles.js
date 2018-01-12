const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = {
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  bg: {
    alignSelf: 'stretch',
    padding:5
    //width: deviceWidth*0.8,
  },
  itemView:{
    borderColor: '#fff',
    borderBottomColor: '#d3d3d3',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    padding:5,
    height:50,
    paddingRight: 16,
    paddingLeft:16
  },
  inviteSearch: {
    height: 33, 
    margin: 1,
    paddingBottom: 5,
    borderColor: '#dcdcdc', 
    backgroundColor: 'white',
    borderRadius: 5, 
    borderWidth: 1,
  },
  
  findPeopleSearchIcon: {
    fontSize: 20, 
    marginTop: 10,
    color:'#979797',
  },
  imageDisplay:{
    width: deviceWidth,
    height: 360
  },
  profileThumbnail: {
    width:40,
    height:40,
    borderRadius: 20,
  },

  profileRowView: {
    flex:1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },

  profileRowText: {
    flex:1, 
    fontSize: 14,
    marginLeft: 10,
    color: '#333333'
  },

  profileRowSubText: {
    flex:1,
    color:'grey', 
    fontSize: 13, 
    marginLeft: 10 
  },
  navbarRightIcon: {
    color: 'white',
    alignSelf: 'center'
  },
  blockedText:{
    color:'grey', 
    fontSize: 18,
    marginBottom:100
  },
  tabText:{
    fontSize: 14,
    fontWeight: "400",
    fontFamily: 'worksans-medium',
    color: "#fff"
  },
    solidButton:{
    backgroundColor:'#5F7EFE',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100,
        borderColor: '#5F7EFE' 
  },

};
