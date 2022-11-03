import "../styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import { ColorModeProvider } from "../contexts/ColorModeContext";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            // console.log(
            //   "Service Worker registration successful with scope: ",
            //   registration.scope
            // );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <ColorModeProvider>
      <AuthProvider>
        <CssBaseline />
        <Head>
          <title>Agora</title>
          <meta
            name="description"
            content="Agora pour vos applications universitaires"
          />
          <link rel="shortcut icon" href="/logo.ico" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </ColorModeProvider>
  );
}

export default MyApp;
