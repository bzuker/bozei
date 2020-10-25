import Head from "next/head";
import AuthProvider from "../context/Auth";
import "../css/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/bozei.svg" />
        <link rel="alternate icon" href="favicon.ico" type="image/x-icon" />
        <link rel="canonical" href="https://bozei.vercel.app/" />
        <title>Bozei</title>
        <meta name="title" content="Bozei" />
        <meta name="description" content="Creá tus juegos y ganá." />
        <meta property="og:title" content="Bozei" />
        <meta property="og:description" content="Creá tus juegos y ganá." />
        <meta property="twitter:url" content="https://bozei.vercel.app/" />
        <meta property="twitter:title" content="Bozei" />
        <meta property="twitter:description" content="Creá tus juegos y ganá." />
        <meta property="og:url" content="https://bozei.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bozei.vercel.app/social.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="https://bozei.vercel.app/social.jpg" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
