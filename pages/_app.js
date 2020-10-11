import EnsureLogin from "../components/EnsureLogin";
import AuthProvider from "../context/Auth";
import "../css/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <EnsureLogin>
        <Component {...pageProps} />
      </EnsureLogin>
    </AuthProvider>
  );
}

export default MyApp;
