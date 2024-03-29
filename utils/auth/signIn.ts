import firebase from "firebase/app";
import "firebase/auth";
import { auth } from "./firebase";
import { mapUserData } from "./mapUserData";
import { setUserCookie } from "./userCookies";

const googleProvider = new firebase.auth.GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const { user } = await auth.signInWithPopup(googleProvider);
    const userData = mapUserData(user);
    setUserCookie(userData);
    return userData;
  } catch (err) {
    console.log(err.message);
  }
}

export async function signInAnonymously(displayName: string) {
  try {
    const { user } = await auth.signInAnonymously();
    await user.updateProfile({
      displayName,
      photoURL: `https://avatars.dicebear.com/api/gridy/${displayName}.svg`,
    });

    const userData = mapUserData({ ...user, displayName });
    setUserCookie(userData);
    return userData;
  } catch (err) {
    console.log(err.message);
  }
}
