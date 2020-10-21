import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
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
        setUser(userData);
      } else {
        setUser();
      }

      setLoadingUser(false);
    });

    return () => cancelAuthListener();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser, logout }}>{children}</AuthContext.Provider>
  );
}

// Custom hook that shorthands the context
export const useUser = ({ redirectTo = false, redirectIfFound = false } = {}) => {
  const router = useRouter();
  const { user, loadingUser, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!redirectTo || loadingUser) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      router.push(redirectTo);
    }
  }, [user]);

  return {
    user,
    loadingUser,
    logout,
  };
};
