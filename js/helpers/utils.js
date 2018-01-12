// FirebaseProperties  to   Custom User
var _ = require('lodash');

const userProperties = [
  {'uid'         : 'uid'},
  {'username'    : 'username'},
  {'name'        : 'name'},
  {'providerData[0].displayName': 'name'},
  {'email'       : 'email'},
  {'providerData[0].email': 'email'},
  {'emailVerified': 'emailVerified'},
  {'photo'        : 'photo'},
  {'providerData[0].photoURL': 'photo'},
  {'isAdmin'      : 'isAdmin'},
  {'phone'        : 'phone'},
  {'about'        : 'about'},
  {'city'         : 'city'},
  {'hasLoggedInWithPassword': 'hasLoggedInWithPassword'},
  {'verifyPhone'  : 'verifyPhone'},
  {'created_at'   : 'created_at'},
  {'ownedEvents'  : 'ownedEvents'},
  {'regUsers'     : 'regUsers'},
  {'inviteUsers'  : 'inviteUsers'},
  {'blockedUsers' : 'blockedUsers'},
  {'fcmToken'     : 'fcmToken'},
  {'latLong'     :  'latLong'},
  {'firstLogin'  :  'firstLogin'}
]

export function transformFirebaseUser(firebaseUser){
  let storeUser = {};
  
  _.map(userProperties, (prop) => 
    _.forOwn(prop, function(dest, source){
        if(_.get(firebaseUser,source) != null){
          storeUser[dest] = _.get(firebaseUser,source)
        }
    })
  )
  return storeUser;
}

export function transformGoogleUser(googleUser){
  const storeUser = {}

  userProperties.map((prop) => {
    if(prop in googleUser){
      storeUser[prop] = googleUser[prop];
    }
    else
      storeUser[prop] = null;
  })

  storeUser['providerData'] = 'google';
  return storeUser;
}

export function synchronizePromise (promise) {
    var value;
    promise.then(function(promiseValue) {
        value = promiseValue;
    });
    while (!value) {} // Wait for promise to resolve

    return value;
};

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

export function capitalize(text) {
  if(text === undefined || text === '' || text === null){
    return text;
  }
  return text.replace(/\w\S*/, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.format = function() {
  var formatted = this;
  for( var arg in arguments ) {
      formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;
};