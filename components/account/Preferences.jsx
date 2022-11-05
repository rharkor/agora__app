import { IconButton, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Stack } from "@mui/system";
import { useTheme } from "@emotion/react";

import { useColorMode } from "../../contexts/ColorModeContext";

const Preferences = () => {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "300",
        }}
      >
        Préférences
      </Typography>
      <Stack
        sx={{
          flexDirection: "row",
          aligItems: "center",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          component="h3"
          variant="h7"
        >
          {theme.palette.mode} mode
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Stack>
    </>
  );
};

export default Preferences;
