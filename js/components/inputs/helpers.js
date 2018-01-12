import {checkUserName, checkEmail} from '../../helpers/db';
import RNFetchBlob from 'react-native-fetch-blob'
import { Dimensions } from 'react-native'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const ASPECT_RATIO = deviceWidth / deviceHeight;
var LATITUDE_DELTA = 0.005922
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

function isEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isUsername(username){
    var re = /^[A-Za-z0-9]+$/;
    return re.test(username);
}

function isNum(input){
    return /^\d+$/.test(input)
}

function isNotEmpty(input){
    return input != "" && input != null
}

function make_promise(res){
    return new Promise(function(resolve, reject){
        if(res.status){
            resolve(res);
        }else{
            reject(res);
        }
    })
}

export function validate_name(input){
    console.log("input is blank", input, input == "")
    return make_promise({status: isNotEmpty(input) , message: "Please enter a valid name"})
}

export function validate_login_email(input){
    let promise1 = make_promise({status: isEmail(input), message:'Invalid Email Format'})
    let promise2 = make_promise({status: isNotEmpty(input), message: "Email can't be blank"})
    return Promise.all([promise1, promise2])
}

export function validate_email(input){
    console.log("input ", input)
    let promise1 = make_promise({status: isEmail(input), message:'Invalid Email Format'})
    let promise2 = checkEmail(input)
    let promise3 = make_promise({status: isNotEmpty(input), message: "Email can't be blank"})
    
    return Promise.all([promise3,promise1,promise2])
}

export function validate_password(input){
    
    return make_promise({status: input.length >= 6 , message: 'Password needs to be atleast 6 characters long'})
}

export function validate_phone(input){    
    let promise1= make_promise({status: isNum(input), message: 'Phone Number is Invalid'})
    let promise2 = make_promise({status: isNotEmpty(input), message: "Phone number can't be blank"})
    return Promise.all([promise1, promise2])
}

export function validate_username(input){
    // check if username is unique
    let promise1 = make_promise({status: isUsername(input), message:'Please enter a valid username. It should only contain letters and numbers'})
    let promise2 = checkUserName(input)
    return  Promise.all([promise1, promise2])
}

export function validate_eventname(input){
    return make_promise({status: input.length > 0, message: 'Event name cannot be blank'})
}

export function getDirection(origin,destination){
    
    const mode = 'driving';
    const APIKEY = 'AIzaSyC4VDnNhM4TjPU2RlsaGILsir0eyF-GBVg';
    const url ='https://maps.googleapis.com/maps/api/directions/json?origin='+origin.latitude+','+origin.longitude+'&destination='+destination.latitude+','+destination.longitude+'&key='+APIKEY+'&mode=[mode]&provideRouteAlternatives=true'
    return RNFetchBlob.fetch('GET', url)
    .then(response => { 
        responseJson = JSON.parse(response.data);
        return (responseJson.routes[0]) ? decode(responseJson.routes[0].overview_polyline.points) : [] // definition below
    })
    .catch(e => {console.warn(e)});
}
function decode(t,e){for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}


export function longLatDistance(lat1,lon1,lat2,lon2) {

    var R = 3981.875; //6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(1) +' Mi'
}

export function getUserRegion(){
    let region=null;
    return new Promise((resolve,reject)=>{
     navigator.geolocation.getCurrentPosition(
      (position) => {

            region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
         return resolve(region)   

      },
      (error) => reject(new Error(error.message)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )   
    })

  }


export function timeRemaining(marker){
        
        let remaining = 60*60*1000;
        
        if(marker.info.finished_at){
            remaining = marker.info.finished_at.timestamp - Date.now();
            if(remaining < 0 )
                remaining = 0;
        }
        
        return remaining;
    }
