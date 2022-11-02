import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import api from "../utils/api";

const defaultContext = {
  email: null,
  univUsername: null,
  token: null,
  admin: false,
  initialized: false,
};

export const AuthContext = createContext({
  ...defaultContext,
  signin: (email, univUsername, token, admin) => {},
  signup: (email, univUsername, token, admin) => {},
  signout: () => {
    localStorage.removeItem("authToken");
  },
  updateInfo: (email, univUsername) => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SIGNUP": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SIGNOUT": {
      return {
        ...defaultContext,
        initialized: true,
      };
    }
    case "INIT": {
      return {
        ...state,
        ...action.payload,
        initialized: true,
      };
    }
    case "UPDATE-INFO": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, defaultContext);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const univUsername = localStorage.getItem("univUsername");
    const token = localStorage.getItem("authToken");
    const admin = localStorage.getItem("admin");

    if (!!univUsername && !!email && !!token && !!admin) {
      dispatch({
        type: "INIT",
        payload: {
          email,
          univUsername,
          token,
          admin,
        },
      });
      api.setAuthToken(token);
    } else {
      dispatch({
        type: "INIT",
        payload: defaultContext,
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      signin: (email, univUsername, token, admin) => {
        localStorage.setItem("email", email ?? "");
        localStorage.setItem("univUsername", univUsername ?? "");
        localStorage.setItem("authToken", token ?? "");
        localStorage.setItem("admin", admin ?? "");

        dispatch({
          type: "SIGNIN",
          payload: {
            email,
            univUsername,
            token,
            admin,
          },
        });

        api.setAuthToken(token);
      },
      signup: (email, univUsername, token, admin) => {
        localStorage.setItem("email", email ?? "");
        localStorage.setItem("univUsername", univUsername ?? "");
        localStorage.setItem("authToken", token ?? "");
        localStorage.setItem("admin", admin ?? "");

        dispatch({
          type: "SIGNUP",
          payload: {
            email,
            univUsername,
            token,
            admin,
          },
        });

        api.setAuthToken(token);
      },
      signout: () => {
        dispatch({
          type: "SIGNOUT",
        });
        localStorage.removeItem("authToken");
      },
      updateInfo: (email, univUsername) => {
        localStorage.setItem("email", email ?? "");
        localStorage.setItem("univUsername", univUsername ?? "");

        dispatch({
          type: "UPDATE-INFO",
          payload: {
            email,
            univUsername,
          },
        });
      },
    }),
    [state, dispatch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContext");
  }
  return context;
};
