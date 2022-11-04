import { useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { subscribeUser } from "../utils/subscription";

const Layout = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // console.log(
          //   "Service Worker registration successful with scope: ",
          //   registration.scope
          // );
          if (token) subscribeUser(registration);
        },
        function (err) {
          console.log("Service Worker registration failed: ", err);
        }
      );
    }
  }, [token]);

  return <>{children}</>;
};

export default Layout;
