import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import { getUserFromCookie, removeUserCookie, setUserCookie } from "../utils/auth/userCookies";
import { mapUserData } from "../utils/auth/mapUserData";
import { auth } from "../utils/auth/firebase";

export const AuthContext = createContext();

export default function ProvideAuth({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const logout = async () => {
    return auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.replace("/login");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = auth.onIdTokenChanged((user) => {
      if (user) {
        const userData = mapUserData(user);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser();
      }

      setLoadingUser(false);
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.replace("/login");
      return;
    }
    setUser(userFromCookie);
    setLoadingUser(false);

    return () => cancelAuthListener();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser, logout }}>{children}</AuthContext.Provider>
  );
}

// Custom hook that shorthands the context
export const useUser = () => useContext(AuthContext);
