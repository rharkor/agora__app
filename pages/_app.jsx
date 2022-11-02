import "../styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import { ColorModeProvider } from "../contexts/ColorModeContext";

function MyApp({ Component, pageProps }) {
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
