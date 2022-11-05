import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import Modal from "../components/Modal";
import MyAccount from "../components/account/MyAccount";
import Preferences from "../components/account/Preferences";
import Admin from "../components/account/Admin";
import SaveSnackbar from "../components/account/SaveSnackbar";

const Account = () => {
  const router = useRouter();
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
  const [multiAccount, setMultiAccount] = useState(false);

  const [basicDataModifications, setBasicDataModifications] = useState(false);
  const [newEmail, setNewEmail] = useState(null);
  const [newUnivUsername, setNewUnivUsername] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newMultiAccount, setNewMultiAccount] = useState(false);

  const [modifications, setModifications] = useState(false);

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

  useEffect(() => {
    if (
      (email !== null && newEmail !== null && email !== newEmail) ||
      (password !== null && newPassword !== null && password !== newPassword) ||
      (univUsername !== null &&
        newUnivUsername !== null &&
        univUsername !== newUnivUsername) ||
      (multiAccount !== null &&
        newMultiAccount !== null &&
        multiAccount !== newMultiAccount)
    ) {
      setBasicDataModifications(true);
    } else {
      setBasicDataModifications(false);
    }
  }, [
    email,
    newEmail,
    univUsername,
    newUnivUsername,
    password,
    newPassword,
    multiAccount,
    newMultiAccount,
  ]);

  useEffect(() => {
    if (basicDataModifications) {
      setModifications(true);
    } else {
      setModifications(false);
    }
  }, [basicDataModifications]);

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

    if (basicDataModifications) {
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
            newPassword:
              newPassword === password ? confirmPassword : newPassword,
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
    }

    // Test if the user still connected after updated data
    try {
      const testAuth = await (await api.defaultFetch("connected")).json();
      if (!testAuth || !testAuth.status || testAuth.status !== "success") {
        throw "Bad token";
      }
    } catch (e) {
      if (e === "Bad token") {
        router.push("/signin");
        signout();
        toast.warning("Veuillez vous reconnecter");
      } else {
        console.error(e);
      }
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={(e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
          toast.warning("Votre mot de passe doit être d'au moins 8 caractères");
          return;
        }

        setConfirmPasswordModal(true);
      }}
    >
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <MyAccount
          email={email}
          newEmail={newEmail ?? ""}
          setNewEmail={setNewEmail}
          univUsername={univUsername}
          newUnivUsername={newUnivUsername ?? ""}
          setNewUnivUsername={setNewUnivUsername}
          password={password}
          newPassword={newPassword ?? ""}
          setNewPassword={setNewPassword}
          signout={signout}
        />
        <Divider />
        <Preferences />
        {admin ? (
          <>
            <Divider />
            <Admin
              multiAccount={multiAccount}
              newMultiAccount={newMultiAccount}
              setNewMultiAccount={setNewMultiAccount}
            />
          </>
        ) : (
          <></>
        )}
      </Container>
      <SaveSnackbar
        display={modifications}
        email={email}
        univUsername={univUsername}
        password={password}
        multiAccount={multiAccount}
        setNewEmail={setNewEmail}
        setNewUnivUsername={setNewUnivUsername}
        setNewMultiAccount={setNewMultiAccount}
        setNewPassword={setNewPassword}
      />
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
    </Box>
  );
};

export default Account;
