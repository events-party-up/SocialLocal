import React, { Component } from 'react';
import { Image , Easing, Animated, View, PanResponder,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Tabs, Content, Button, Icon, List, ListItem, Text, Footer } from 'native-base';
import Marker from './Marker';
import PanController from './PanController';
import MapEventInfo from './MapEventInfo';
import CountDownTimer from './countDownTimer';
var Analytics = require('react-native-firebase-analytics');

const ReactNative = require('react-native');

const { StyleSheet, Dimensions, Platform } = ReactNative;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ASPECT_RATIO = deviceWidth / deviceHeight;
var LATITUDE_DELTA = 0.016922
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = deviceWidth - (2 * ITEM_SPACING) - (2 * ITEM_PREVIEW);
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = deviceWidth / ITEM_WIDTH;
const TASK_BAR_HEIGHT=50;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);
const relocate  = require('../../../images/Relocate.png');
import MapView from 'react-native-maps';

function getMarkerState(panX, panY, scrollY, i) {
  const xLeft = (-SNAP_WIDTH * i) + (SNAP_WIDTH / 2);
  const xRight = (-SNAP_WIDTH * i) - (SNAP_WIDTH / 2);
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp',
  });

  const center = panX.interpolate({
    inputRange: [xPos - 10, xPos, xPos + 10],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const translateY = Animated.multiply(isIndex, panY);

  const translateX = panX;

  const anim = Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }));

  const scale = Animated.add(ONE, Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, SCALE_END - 1],
    extrapolate: 'clamp',
  })));

  let width = Animated.add(ONE, Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT2],
    outputRange: [ITEM_WIDTH, deviceWidth],
    extrapolate: 'clamp',
  })));

  width = Animated.add(width, Animated.multiply(isNotIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT2],
    outputRange: [ITEM_WIDTH, ITEM_WIDTH],
    extrapolate: 'clamp',
  })))

  //width = Animated.multiply(isNotIndex, width)

  // [0 => 1]
  let opacity = scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // if i === index: [0 => 0]
  // if i !== index: [0 => 1]
  opacity = Animated.multiply(isNotIndex, opacity);


  // if i === index: [1 => 1]
  // if i !== index: [1 => 0]
  opacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  let markerOpacity = scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.28],
  });

  const color = selected.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff',  '#26CE99'],
    });
  const countDownTimerColor = selected.interpolate({
      inputRange: [0, 1],
      outputRange: ['#5F7EFE',  '#ffffff'],
    });

  const zIndex = selected.interpolate({
      inputRange: [0, 1],
      outputRange: [0,  1],
    });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    anim,
    center,
    width,
    selected,
    markerOpacity,
    markerScale,
    color,
    countDownTimerColor,
    zIndex,
    isIndex
  };
}


export default class Map extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      overlay: false,
      active: this.props.active
    }
    
    this.offset = 0

    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

     
    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });

    const {markers} = this.props;
    const animations = markers.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i));
    
    const event = this.props.data;
    const eventlatitude = _.get(event,'info.location.latitude')
    const eventlongitude = _.get(event,'info.location.longitude')

    let latitude =  _.get(this.props, 'user.latLong.latitude')
    let longitude = _.get(this.props,'user.latLong.longitude')
    
    this.state = {
      panX,
      panY,
      animations,
      index: 0,
      canMoveHorizontal: true,
      scrollY,
      scrollX,
      scale,
      mapActive: false,
      translateY,
      markers,
      fullView: false,
      region: new MapView.AnimatedRegion({
        latitude: eventlatitude || latitude ,
        longitude:  eventlongitude || longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    };
  }

  static PropTypes ={
        pickLocationPin: React.PropTypes.bool,
        path: React.PropTypes.bool,
        pathCoordinates: React.PropTypes.array,
        getLatLong: React.PropTypes.func,
    }
  static defaultProps ={
    height: deviceHeight,
    markers: [],
    active: true,
    onlyMarker: false,
    pickLocationPin: false,
    path: false,
    isReady:false,

    relocateX: 10,
    relocateY: 130
  }

  // value goes from 0 to 1 where 0 belongs to closed state and 1 belongs to open state.
  // in 0 we have opacity : 0 ( completely shown )
  // in 1 we have opacity : 0.5 ( partly shown )
  
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  }
  
  isNearToRelocationIcon(evt){
    let x = evt.nativeEvent.pageX
    let y = evt.nativeEvent.pageY

    let delta = 30;

    // 20 is the arrow icon size
    // 50 is the offset I found during debugging. must be bar height
    relocateIconX = this.pageX + this.width - this.props.relocateX - 20;
    relocateIconY = this.pageY + this.props.relocateY - 20 + 50;
    // console.log("x ", x, "y : ", y);
    // console.log("pageX ", this.pageX, "page Y : ", this.pageY)
    // console.log("relocateIconX", relocateIconX, "relocateIconY", relocateIconY);
    
    if (x >= relocateIconX - delta && x <= relocateIconX + delta &&
        y >= relocateIconY - delta && y <= relocateIconY + delta
    ){
      //console.log("return true")
      return true;
    }
    else
      return false;
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder:()=> false,
      onMoveShouldSetPanResponder:()=>false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => this.isNearToRelocationIcon(evt),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.isNearToRelocationIcon(evt),
         onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        this.mapRef._component.animateToCoordinate(this.state.userLocation);
        
      },
        onPanResponderMove: (evt, gestureState) => {
            // DO JUNK HERE
        }
    });

    //this.setNavigation();
  }
  
  componentWillReceiveProps(nextProps, nextState){
    
    let array1 = this.state.markers;
    let array2 = nextProps.markers;
    //Analytics.setUserId('11111');
    //Analytics.setUserProperty('eventlog', 'map');
    
    let is_same = (array1.length == array2.length) && array1.every(function(element, index) {
      return JSON.stringify(element) === JSON.stringify(array2[index]); 
    });
    
    
    if(!is_same){
      
      this.setState({markers: nextProps.markers})
      const animations = nextProps.markers.map((m, i) =>
        getMarkerState(this.state.panX, this.state.panY, this.state.scrollY, i));
      this.setState({animations})

      const {markers} = nextProps;
      let indexValue = (this.state.index < 0)? 0 : this.state.index
      if(indexValue >= markers.length)
        indexValue = markers.length -1
      
      
      Animated.spring(this.state.panX, { toValue: -indexValue * SNAP_WIDTH }).start();

      const {region} = this.state;
      
      if(nextProps.markers[indexValue]){
        const latitude = _.get(nextProps.markers[indexValue],'info.location.latitude');
        const longitude = _.get(nextProps.markers[indexValue], 'info.location.longitude');
        let latitudeDelta = _.get(region, 'latitudeDelta._value');
        let longitudeDelta = _.get(region,'longitudeDelta._value');

        // this is a hack to show first screen on map load to user location
        if(latitudeDelta > 10 || longitudeDelta > 10){
          latitudeDelta = null;
          longitudeDelta = null;
        }

        this.setState({
          region: new MapView.AnimatedRegion({
          latitude: latitude,
          longitude:  longitude,
          latitudeDelta: latitudeDelta ? latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: longitudeDelta? longitudeDelta : LONGITUDE_DELTA,
          })
        })
      }

      // set pan animation
      this.setRegionAnimation(nextProps.markers)
    }
    
    if(nextProps.active && this.props.active !== nextProps.active){
      this.setState({active: nextProps.active})
    }

    // this is required for editing party and showing path location
    if(nextProps.marker){
      const latitude = _.get(nextProps.marker,'info.location.latitude');
      const longitude = _.get(nextProps.marker, 'info.location.longitude');
      this.setState({
        region: new MapView.AnimatedRegion({
        latitude: latitude || 37.785834,
        longitude:  longitude || -122.406417,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        })
      })

      this.setState({markers: [nextProps.marker]})
      const animations = getMarkerState(this.state.panX, this.state.panY, this.state.scrollY, 0);
      this.setState({animations:[animations]})
    }
  }

  setRegionAnimation(markers){
    const { region, panX, panY, scrollX } = this.state;
    markers.length > 1 && region.timing({
      latitude: scrollX.interpolate({
        inputRange: markers.map((m, i) => i * SNAP_WIDTH),
        outputRange: markers.map(m => m.info.location.latitude),
      }),
      longitude: scrollX.interpolate({
        inputRange: markers.map((m, i) => i * SNAP_WIDTH),
        outputRange: markers.map(m => m.info.location.longitude),
      }),
      duration: 0,
    }).start();
  }

  measureView(){
    
    this.mapRef2 && this.mapRef2.measure((a, b, width, height, px, py)=>{
      this.pageX = px;
      this.pageY = py;
      this.x = a;
      this.y = b;
      this.width = width;
      this.height = height;
    })
  }

  componentDidUpdate(){
    setTimeout(this.measureView.bind(this));
  }

  componentDidMount() {
    
    const { region, panX, panY, scrollX, markers } = this.state;

    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);

    region.stopAnimation();
    this.setNavigation();
    this.setRegionAnimation(markers)
  }

    onStartShouldSetPanResponder = (e, gestureState) => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.

    // if map shows only marker then no need to have pan responder
     const {markers} = this.state;
     if(this.props.onlyMarker || markers.length === 0)
      return false;

    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue() + TASK_BAR_HEIGHT;
    const topOfTap = deviceHeight - pageY;

    
    return topOfTap < topOfMainWindow;
  }

  onMoveShouldSetPanResponder = (e, gestureState) => {
    const { panY } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue() + TASK_BAR_HEIGHT;
    const topOfTap = deviceHeight - pageY;
    
    // if map shows only marker then no need to have pan responder
    const {markers} = this.state;
    
    if(this.props.onlyMarker || markers.length == 0)
      return false;
    
    
    
    return topOfTap < topOfMainWindow && gestureState.dx != 0 && gestureState.dy != 0;
    
  }

  onPanXChange = ({ value }) => {
    //const { index } = this.state;
    
    let  { canMoveHorizontal, region, scrollY, scrollX, markers, index } = this.state;
    const newIndex = Math.floor(((-1 * value) + (SNAP_WIDTH / 2)) / SNAP_WIDTH) >= markers.length ? markers.length -1 : Math.floor(((-1 * value) + (SNAP_WIDTH / 2)) / SNAP_WIDTH) ;
    if (index !== newIndex) {
      
      this.setState({ index: newIndex });
      index = newIndex;
    }

    if( markers.length > 1 ){
    region.stopAnimation();
        region.timing({
          latitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.info.location.latitude),
          }),
          longitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.info.location.longitude),
          }),
          duration: 0,
        }).start();
      }
  }

  onPanYChange = ({ value }) => {
    
    let { canMoveHorizontal, region, scrollY, scrollX, markers, index } = this.state;
    const shouldBeMovable = Math.abs(value) < 2 && markers.length > 1 
    //const shouldBeMovable = markers.length >= 2;
    // shouldbeMovable must be false if markers length is less than or equal to 1
    
    if (shouldBeMovable !== canMoveHorizontal) {

      if(markers.length == 0 || index < 0)
        return;

      this.setState({ canMoveHorizontal: shouldBeMovable });
      if (!shouldBeMovable) {
        // don't do anything if there are no markers

        const { location } = markers[index].info;
        region.stopAnimation();
        region.timing({
          latitude: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [  
              location.latitude,
              location.latitude - (LATITUDE_DELTA * 0.5 * 0.375),
            ],
            extrapolate: 'clamp',
          }),
          latitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
            extrapolate: 'clamp',
          }),
          longitudeDelta: scrollY.interpolate({
            inputRange: [0, BREAKPOINT1],
            outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
            extrapolate: 'clamp',
          }),
          duration: 0,
        }).start();
      } else {
        
        region.stopAnimation();
        region.timing({
          latitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.info.location.latitude),
          }),
          longitude: scrollX.interpolate({
            inputRange: markers.map((m, i) => i * SNAP_WIDTH),
            outputRange: markers.map(m => m.info.location.longitude),
          }),
          duration: 0,
        }).start();
      }
    }
  }

  setNativeProps({value}){
    if(!this.screen)
      return;
    let n = parseFloat(value);
    
    if(n === 0.0){  
      this.screen.setNativeProps({style:{opacity:n/2.0,height: 0}})
    }
    else
      this.screen.setNativeProps({style:{opacity:n/2.0, height: deviceHeight }})
  }

  toggle(){
    
    this.setState({overlay: !this.state.overlay});
  }

  setNavigation(){
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        
      
         this.setState({ region: new MapView.AnimatedRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
         }),
         userLocation:{
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
          },
          mapActive: true});

         if (this.props.getLatLong) 
          this.props.getLatLong(this.state.userLocation);
      },
      (error) => {
        
        if(!this.state.mapActive)           // if map is loaded any time. //this.state.mapActive
          this.props.resetRoute('noop');
        else{
          // try to fetch the location from previous load
          const {latitude, longitude} = this.props.user.latLong;
          this.setState({ region: new MapView.AnimatedRegion({
                          latitude: latitude,
                          longitude: longitude,
                          latitudeDelta: LATITUDE_DELTA,
                          longitudeDelta: LONGITUDE_DELTA,
                        }),
                        userLocation:{
                          latitude,
                          longitude 
                        }
                      },
                      
                    );
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000*180}
    )


  }

  getMarker(){
    const {markers, animations,onRegionChange} = this.state;
    
    return markers.map((marker, i) => {
        const {
                selected,
                markerOpacity,
                markerScale,
                color,
                countDownTimerColor,
              } = animations[i];
        return (
                  <MapView.Marker.Animated
                      key={marker.id}
                      coordinate={marker.info.location}
                      style={{
                      opacity: markerOpacity,
                      borderRadius:10,
                      transform: [
                        { scale: markerScale },
                      ],
                      shadowColor:'black',
                      shadowOffset:{width:0,height:2},
                      shadowOpacity:0.4,
                    }}
                  >
                    { !this.props.onlyMarker && <TouchableOpacity onPress={()=> {
                            Animated.spring(this.state.panX, {
                              toValue: -(i)*SNAP_WIDTH
                            }).start();
                          } 
                        } style={styles.talkBubble}>
                      <Animated.View  style={_.assign({}, styles.talkBubbleSquare, {backgroundColor: color} )} >
                        <CountDownTimer countDownComplete={()=> this.props.onCounTDownEnd() }  
                          event={marker} style={{alignSelf:'center',textAlign: 'center',color:countDownTimerColor}} />
                      </Animated.View>
                      <Animated.View style={_.assign({}, styles.talkBubbleTriangle, {borderTopColor: color})} />
                    </TouchableOpacity>}   
                  </MapView.Marker.Animated>
              )
    })
  }

  getLines(){
    const {markers, animations} = this.state;
    return markers.map((marker, i) => {
        const {
                selected,
                markerOpacity,
                markerScale,
              } = animations[i];
        return(
          <MapView.Polyline
              key={i}
              coordinates={[
                ...this.props.pathCoordinates,
              ]}
              strokeWidth={2}
              lineDashPhas={2}
              strokeColor='green'
          />
        );
    })
  }
  
  
  getMarkerViews(){
    const {markers, animations} = this.state;
    return (
       <View style={styles.itemContainer}
          onLayout={(event)=> { 
            var { x, y , width, height} = event.nativeEvent.layout;
            //ITEM_PREVIEW_HEIGHT = height;
            
          }}
       >
            {markers.map((marker, i) => {
              const {
                translateY,
                translateX,
                scale,
                opacity,
                width
              } = animations[i];
              
              return (
                <MapEventInfo
                  key={marker.id}
                  event={marker}
                  userLocation={this.props.user.latLong}
                  eventId={marker.id}
                  uid={this.props.uid}
                  fullView={this.state.fullView}
                  onAddTime={this.props.onAddTime.bind(this,marker)}
                  onInvitationStatusChange={(event,uid,status)=>{this.props.onInvitationStatusChange(marker,uid,status)}}
                  onPressInfo= {(event)=> {event['id']=marker.id; this.props.onPressInfo(event)}}
                  onShowStatus={this.props.onShowStatus.bind(null,marker)}
                  onOptionsPress={ (event)=> this.props.onOptionsPress(event)}
                  style={_.assign({},styles.item, {
                    opacity,
                    width,
                    transform: [
                      { translateY },
                      { translateX },
                    ],
                  })}
                />
              );
            })}
          </View>
    );
  }

  onRegionChange(region){
    
    this.state.region.setValue(region);
  }

  getLocationPicker(){
    if (this.props.pickLocationPin){
    return(
        <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Icon pointerEvents="none" name='ios-pin' style ={{color:'red'}} />
        </View>
      );
    }
    else{
      return
    }
  }
  getRelocatingIcon(){
    
    return(
        <TouchableOpacity pointerEvents="none" >
          <Image source={relocate} style={{position: 'absolute', top: this.props.relocateY,  right: this.props.relocateX, width: 50, height:50}} />
        </TouchableOpacity>
      );
  }
  render(){
    let {
      panX,
      panY,
      animations,
      canMoveHorizontal,
      markers,
      region,
    } = this.state;

    let height = this.props.height
    
    return(
      <View style={_.assign({},this.props.style, {height})}
        {...this._panResponder.panHandlers}
        ref={c => this.mapRef2 = c }
      >

      
      <PanController
            style={_.assign({},this.props.style, {height})}
            vertical
            horizontal={canMoveHorizontal}
            xMode="snap"
            snapSpacingX={SNAP_WIDTH}
            yBounds={[-1 * deviceHeight, 0]}
            xBounds={[-deviceWidth * (markers.length - 1), 0]}
            panY={panY}
            panX={panX}
            onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
            onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
          >

                {this.props.active &&
        <MapView.Animated key="mapview" style={_.assign({},this.props.style,{height})}
          //initialRegion={this.state.region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          region={region}
          ref={c => this.mapRef = c }
          onRegionChangeComplete={(region) => { this.onRegionChange(region)} }
        > 

          {this.getLocationPicker()}
          {this.getRelocatingIcon()}   
          {this.getMarker()}
          {this.props.path && this.getLines()}
        </MapView.Animated>
      }
          {!this.props.onlyMarker && this.getMarkerViews()}
        </PanController>
     
    </View>
    );
  }
}

const styles = {
  itemContainer: {
    backgroundColor: 'transparent',
    //backgroundColor: 'blue',
    flexDirection: 'row',
    paddingHorizontal: (ITEM_SPACING / 2) + ITEM_PREVIEW,
    position: 'absolute',
    top: deviceHeight - ITEM_PREVIEW_HEIGHT,
    //paddingTop: deviceHeight - ITEM_PREVIEW_HEIGHT,
    // paddingTop: !ANDROID ? 0 : screen.height - ITEM_PREVIEW_HEIGHT - 64,
  },
  item: {
    width: ITEM_WIDTH,
    height: deviceHeight + (2 * ITEM_PREVIEW_HEIGHT),
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 3,
  },
  talkBubble: {
    backgroundColor: 'transparent',
    flexDirection:'column',
    justifyContent:'center'
  },
  talkBubbleSquare: {
    width: 70,
    height: 30,
    backgroundColor: '#5F7EFE',
    borderRadius: 10,
    padding:5,
    justifyContent:'center',
    
  },
  talkBubbleTriangle: {
    alignSelf:'center',
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: '#5F7EFE',
    borderLeftColor: 'transparent',
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderRightWidth: 5,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0, 
    shadowColor:'black',
    shadowOffset:{width:0, height:1},
    shadowOpacity:0.1
  }
}
