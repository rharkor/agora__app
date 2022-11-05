import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const mode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", mode);
          return mode;
        });
      },
    }),
    []
  );

  useEffect(() => {
    const storedMode = localStorage.getItem("colorMode");
    if (!storedMode) return;
    setMode(storedMode);
  }, []);

  const theme = useMemo(() => {
    let themeMemo = createTheme({
      palette: {
        mode,
        background: {
          default: mode === "light" ? "#eeeeee" : "#121212",
        },
      },
    });
    themeMemo = responsiveFontSizes(themeMemo);

    return themeMemo;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error("useColorMode must be used within an ColorModeContext");
  }
  return context;
};
