import { useUser } from "../context/Auth";

const EnsureLogin = ({ children }) => {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return null;
  }

  if (!user && window.location.pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
};

export default EnsureLogin;
