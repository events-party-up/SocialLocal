import MapView from 'react-native-maps';
import React, { Component } from 'react';
import {View,Dimensions,Image} from 'react-native'
import { Icon,Thumbnail} from 'native-base';

import Marker from './Marker';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ASPECT_RATIO = deviceWidth / deviceHeight;
var LATITUDE_DELTA = 0.005922
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const logo  = require('../../../images/pin.png');

export default class LocationPickerMap extends Component {
	constructor(props){
    super(props);
    this.state = {
      overlay: false,
      active: this.props.active,
      region: this.getRegion(this.props.regionData.latitude,this.props.regionData.longitude)
    }
  }

  	static PropTypes ={
        region: React.PropTypes.object,
        regionChanged: React.PropTypes.func,
    	  pickLocationPin: React.PropTypes.bool,
    }

    static defaultProps ={
	    markers: [],
	    active: true,
	    pickLocationPin: false,
	    onlyMarker: false,
	    
  	}

    componentWillReceiveProps(nextProps){
			this.setState({ region: this.getRegion(nextProps.regionData.latitude,nextProps.regionData.longitude)})
		}
    componentWillUnmount(){
      this.mount = false;
    }
		getRegion(lat,longi){
			region = {
	              latitude: lat,
	              longitude: longi,
	              latitudeDelta: LATITUDE_DELTA,
	              longitudeDelta: LONGITUDE_DELTA,
	             }
               return region;
		}

	getLocationPickerPin(){
    if (this.props.pickLocationPin){
      return(
        <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Image style={{width:30,height:30}} source={logo} />
        </View>
      );
    }
    else{
      return (<MapView.Marker
                      coordinate={this.getRegion(this.props.regionData.latitude,this.props.regionData.longitude)}
                  />);
    }
  }

  getLine(){
  	let latlong = [{latitude: 37.785834,longitude: -122.4324, }, {latitude: this.state.region.latitude , longitude: this.state.region.longitude }]
  	return(<MapView.Polyline
  				coordinate= {latlong}
  				strokeColor={'#000'}
  				strokeWidth={2}
  				geodesic={true}
  					/>);
  				
  }

    render(){
    	return(
    		<View>
	    		<MapView
	            style={{height:160}}
              initialRegion={this.props.initialRegion}
              region={this.state.region}
              showsUserLocation={true}
	            onRegionChangeComplete={(region)=> {this.props.regionChanged(region)}}
	          >	
	            {this.getLocationPickerPin()}
	            {this.getLine()}
	        </MapView>
        </View>
       ); 
    }
}
