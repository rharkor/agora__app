import { useTheme } from "@emotion/react";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useColorMode } from "../contexts/ColorModeContext";
import api from "../utils/api";
import Modal from "../components/Modal";

const Account = () => {
  const {
    email,
    univUsername,
    admin,
    token,
    initialized,
    updateInfo,
    signout,
  } = useAuth();

  const password = "pasbiença";
  const router = useRouter();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const [multiAccount, setMultiAccount] = useState(false);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newUnivUsername, setNewUnivUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newMultiAccount, setNewMultiAccount] = useState(false);

  useEffect(() => {
    if (!email) return;
    setNewEmail(email);
  }, [email]);

  useEffect(() => {
    if (!univUsername) return;
    setNewUnivUsername(univUsername);
  }, [univUsername]);

  useEffect(() => {
    if (!password) return;
    setNewPassword(password);
  }, [password]);

  useEffect(() => {
    setNewMultiAccount(multiAccount);
  }, [multiAccount]);

  const getMultiAccountData = async () => {
    const response = await api.fetch("multiple-users");
    if (response.multipleUsers) {
      setMultiAccount(true);
    }
  };

  useEffect(() => {
    if (initialized && !token) {
      router.push("/signin");
    } else if (initialized && token) {
      getMultiAccountData();
    }
  }, [token, initialized]);

  const handleSave = async () => {
    setConfirmPasswordModal(false);
    const apiCall = api
      .fetch("update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: confirmPassword,
          newEmail: newEmail,
          newPassword: newPassword === password ? confirmPassword : newPassword,
          newUnivUsername,
          newMultiAccount,
        }),
      })
      .then(() => {
        updateInfo(newEmail, newUnivUsername);
        setMultiAccount(newMultiAccount);
      })
      .catch(async (e) => {
        try {
          const json = await e.json();
          if ((json.error = "No corresponding account found")) {
            throw "Votre mot de passe ne correspond pas";
          } else {
            console.error(e);
            throw "Echec, veuillez ressayer";
          }
        } catch (e) {
          throw "Echec, veuillez ressayer";
        }
      });

    await toast.promise(apiCall, {
      pending: "Mis a jour en cours..",
      success: "Donnée mise à jour!",
      error: {
        render({ data }) {
          return data;
        },
      },
    });
  };

  const deleteAccount = async () => {
    await api.fetch("delete-account", {
      method: "POST",
    });
    signout();
    router.push("/signup");
  };

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        marginTop: "1rem",
      }}
    >
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
          Nom d'utilisateur universitaire
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
      <Divider />
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
      {admin ? (
        <>
          <Divider />
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: "300",
            }}
          >
            Espace admin
          </Typography>
          <Stack
            sx={{
              gap: ".5rem",
            }}
          >
            <Typography component="h3" variant="h5">
              Plusieurs compte utilisateur
            </Typography>
            <Typography component="p" color="error">
              Désactiver par défaut pour éviter les bans ip du serveur
            </Typography>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={newMultiAccount}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewMultiAccount(true);
                  } else {
                    setNewMultiAccount(false);
                  }
                }}
              />
              <Typography
                color={multiAccount !== newMultiAccount ? "orange" : ""}
              >
                Multi compte
              </Typography>
            </Stack>
          </Stack>
        </>
      ) : (
        <></>
      )}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "1rem",
          alignSelf: "flex-end",
        }}
      >
        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            setNewEmail(email);
            setNewUnivUsername(univUsername);
            setNewPassword(password);
            setNewMultiAccount(multiAccount);
            router.back();
          }}
        >
          Annuler
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => {
            setConfirmPasswordModal(true);
          }}
        >
          Sauvegarder
        </Button>
      </Stack>
      <Modal
        open={confirmPasswordModal}
        onClose={() => {
          setConfirmPasswordModal(false);
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mot de passe actuel"
          type="password"
          id="password"
          autoComplete="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        <Stack
          sx={{
            flexDirection: "row",
            gap: "1rem",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setConfirmPassword("");
              setConfirmPasswordModal(false);
            }}
          >
            Annuler
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setConfirmPassword("");
              handleSave();
            }}
          >
            Mettre à jour mes informations
          </Button>
        </Stack>
      </Modal>
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
    </Container>
  );
};

export default Account;
