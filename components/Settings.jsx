import { useState } from "react";
import Link from "next/link";

import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { signout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = !!anchorEl;

  return (
    <section>
      <Button
        onClick={handleClick}
        variant="contained"
        aria-label="Settings popover button"
      >
        <SettingsIcon />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
          marginTop: "1rem",
        }}
      >
        <ul
          style={{
            padding: "1rem",
          }}
        >
          <li>
            <Link href="/account">
              <Button
                sx={{
                  gap: ".5rem",
                }}
                onClick={() => {
                  setAnchorEl(null);
                }}
              >
                <AccountCircleIcon /> Compte
              </Button>
            </Link>
          </li>
          <hr />
          <li>
            <Button
              color="error"
              sx={{
                gap: ".5rem",
              }}
              onClick={() => {
                setAnchorEl(null);
                signout();
              }}
            >
              <LogoutIcon /> Déconnexion
            </Button>
          </li>
        </ul>
      </Popover>
    </section>
  );
};

export default Settings;
