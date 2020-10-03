import firebase from "firebase";
import initFirebase from "./initFirebase";
import { mapUserData } from "./mapUserData";
import { setUserCookie } from "./userCookies";

initFirebase();

export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const { user } = await auth.signInWithPopup(googleProvider);
    const userData = mapUserData(user);
    setUserCookie(userData);
  } catch (err) {
    console.log(err.message);
  }
}
