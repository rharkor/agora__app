import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../contexts/AuthContext";
import { subscribeUser } from "../utils/subscription";

const Layout = ({ children }) => {
  const { token, signout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        async function (registration) {
          // console.log(
          //   "Service Worker registration successful with scope: ",
          //   registration.scope
          // );
          try {
            if (token) {
              await subscribeUser(registration);
            }
          } catch (e) {
            if (e.message && e.message === "Error. Bad token") {
              router.push("/signin");
              signout();
              toast.warning("Veuillez vous reconnecter");
            } else {
              console.error(e);
            }
          }
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
