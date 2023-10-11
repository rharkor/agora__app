import { Button, Typography, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Modal from "../Modal";

import api from "../../utils/api";
import { useRouter } from "next/router";

const MyAccount = ({
  email,
  newEmail,
  setNewEmail,
  univUsername,
  newUnivUsername,
  setNewUnivUsername,
  password,
  newPassword,
  setNewPassword,
  signout,
}) => {
  const router = useRouter();

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const deleteAccount = async () => {
    await api.fetch("delete-account", {
      method: "POST",
    });
    signout();
    router.push("/signup");
  };

  return (
    <>
      <Typography
        component={"h1"}
        variant="h3"
        sx={{
          alignSelf: "center",
        }}
      >
        Mon compte
      </Typography>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "300",
        }}
      >
        Mes informations personnelles
      </Typography>
      <Stack
        sx={{
          gap: ".5rem",
        }}
      >
        <Typography component="h3" variant="h5">
          Email
        </Typography>
        {email !== newEmail ? (
          <TextField
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
            type={"email"}
            color="warning"
            focused
          />
        ) : (
          <TextField
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
            type={"email"}
            color={email !== newEmail ? "warning" : ""}
          />
        )}
      </Stack>
      <Stack
        sx={{
          gap: ".5rem",
        }}
      >
        <Typography component="h3" variant="h5">
          Url de l'emploi du temps
        </Typography>
        {univUsername !== newUnivUsername ? (
          <TextField
            value={newUnivUsername}
            onChange={(e) => {
              setNewUnivUsername(e.target.value);
            }}
            color="warning"
            focused
          />
        ) : (
          <TextField
            value={newUnivUsername}
            onChange={(e) => {
              setNewUnivUsername(e.target.value);
            }}
          />
        )}
      </Stack>
      <Stack
        sx={{
          gap: ".5rem",
        }}
      >
        <Typography component="h3" variant="h5">
          Mot de passe
        </Typography>
        {newPassword !== password ? (
          <TextField
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            type="password"
            color="warning"
            focused
          />
        ) : (
          <TextField
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            type="password"
          />
        )}
      </Stack>
      <Button
        variant="contained"
        color="error"
        sx={{
          alignSelf: "flex-end",
        }}
        onClick={() => {
          setDeleteAccountModal(true);
        }}
      >
        Supprimer le compte
      </Button>
      <Modal
        open={deleteAccountModal}
        onClose={() => {
          setDeleteAccountModal(false);
        }}
      >
        <Typography variant="h6" component="h2">
          Êtes vous sûr de vouloir supprimer votre compte ?
        </Typography>
        <Stack
          sx={{
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setDeleteAccountModal(false);
            }}
          >
            Non
          </Button>
          <Button color="error" onClick={deleteAccount}>
            Oui je suis sûr
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MyAccount;
