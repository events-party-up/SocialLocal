
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = {
  container:{
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  roundedButton: {
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: '#00c497',
    borderRadius: 90,
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    color: 'red',
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
  },
  closeIcon: {
    marginTop: (Platform.OS === 'ios') ? 2 : -7
  },
  map:{
    height: deviceHeight
  },
  desc:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  header:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  overlay:{
    flex: 1,
    position: 'absolute',
    left:0 ,
    top: 0,
    opacity: 0,
    backgroundColor: 'black',
    width: deviceWidth,
    height: deviceHeight
  },
   actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  mb25: {
    marginTop: 15,
    marginBottom: 15,
  },

  input:{
    marginTop: 15,
    marginBottom:15,
  },
  button:{
    width: deviceWidth*0.5,
    marginTop: 20,
    height: 40,
    alignSelf: 'center'
  },
  bottomText:{
    marginTop: 5,
    flex: 1,
    alignSelf: 'center',
    flexDirection:'row',
    justifyContent:'space-between',
    width: deviceWidth*0.6
  },
  circle:{
    width: 200,
    height: 200,
    borderRadius: 200/2,
    backgroundColor: 'gray',
    margin:10,
    alignSelf: 'center'
  },
  border:{
    borderColor:'#B2B2B2',
    borderWidth:1,
    borderStyle:'solid',
    height: 50,
    width:deviceWidth,
    flexDirection:'row'
  },
  tabSelected:{
    flex:1,  
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth:1.5, 
    borderBottomColor: '#5F7EFE',
    borderStyle:'solid',
    borderColor:'#B2B2B2'
  },
  tabUnSelected:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'#B2B2B2'
  },
  tabText:{
    fontSize: 14,
    fontWeight: "400",
    color: "#333333",
    fontFamily: 'worksans-medium'
  },
  hollowButton:{
    backgroundColor:'transparent',
        borderWidth: 1,
        marginLeft: 15,
        marginRight: 10,
        borderStyle: 'solid',
        borderRadius: 100,
        height: 32,
        width: 95,
        borderColor: '#5F7EFE'
  },
  solidButton:{
    backgroundColor:'#5F7EFE',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100,
        height: 40,
        width: 140,
        borderColor: '#5F7EFE' 
  },

  inviteSearch: {
    height: 30, 
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

  editOptionsTab: {
    flexDirection: 'row',
    paddingTop: 17,
    paddingBottom:17,
    paddingLeft:16,
    paddingRight:16,
    height:44,
    justifyContent: 'center',
    alignItems: 'center'
  },

  editOptionsTabText: {
    flex:1,
    fontFamily: 'worksans-medium',
    fontSize: 14, 
    alignSelf: 'center' 
  },

  editOptionsTabIcon:{ 
    alignSelf: 'center',
    marginRight:5
  },

  profileButtonsView:{
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8 
  },

  messageButtonText:{
    color: 'white',
    fontSize: 14,
    color:'#FFF',
    fontFamily:'worksans-medium',
    alignSelf:'center',
    textAlign:'center'
  },

  profileThumbnail: {
    width:40,
    height:40,
    borderRadius: 20,
  },

  profileRowView: {
    flex:1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom:10,
    paddingLeft: 16,
    paddingRight:16,
    alignItems: 'center',
    maxHeight: 60
  },

  profileRowText: {
    flex:1, 
    fontSize: 14,
    marginLeft: 10,
    color: '#333333',
    fontFamily: 'worksans-regular'
  },

  profileRowSubText: {
    flex:1,
    color:'#9B9B9B', 
    fontSize: 14, 
    marginLeft: 10,
    fontFamily: 'worksans-regular' 
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
  userImageRound:{
    alignSelf:'center',
    width:80,
    height:80,
    borderRadius:40 ,
    marginBottom:10,
    marginTop:26
  },
  userImageLarge:{
    alignSelf:'center',
    height:300,
    marginBottom:10,
  },
  blankImageStyle: {
    width: 80, 
    height: 80, 
    borderRadius: 0, 
    alignSelf:'center', 
    marginBottom:20
  },
  uploadedImageStyle: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignSelf:'center', 
    marginBottom:20
  }
};
