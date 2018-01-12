import { GoogleSignin } from 'react-native-google-signin';

export async function _setupGoogleSignin() {
  try {
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    await GoogleSignin.configure({
      // scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      iosClientId: '963596590141-sg64vkdjtqft16affptq635hqmshuvqt.apps.googleusercontent.com',
      //webClientId: '963596590141-6177cacg2sm186kq0qphe93daj4l6mo2.apps.googleusercontent.com',
      offlineAccess: false
    });
    const user = await GoogleSignin.currentUserAsync();

  }
  catch(err) {
    console.log("Google signin error", err.code, err.message);
  }
}

export default GoogleSignin;
