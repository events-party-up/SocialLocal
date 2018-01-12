import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAL4uDNbQRbcHnC8uIlDSjdxnXGjsWNvrw",
    authDomain: "socialvite-164400.firebaseapp.com",
    databaseURL: "https://socialvite-164400.firebaseio.com",
    projectId: "socialvite-164400",
    storageBucket: "socialvite-164400.appspot.com",
    messagingSenderId: "963596590141"
}

firebase.initializeApp(config);

export const ref = firebase.database().ref('/')
export const firebaseAuth = firebase.auth
export const storage = firebase.storage().ref();
