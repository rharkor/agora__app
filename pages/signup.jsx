import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";

import api from "../utils/api";
import Flash from "../components/Flash";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [willBeAdmin, setWillBeAdmin] = useState(false);

  const router = useRouter();
  const { signup } = useAuth();

  const [isSending, setIsSending] = useState(false);

  const getWillBeAdmin = async () => {
    const result = await api.fetch("have-admin");
    setWillBeAdmin(!result.haveAdmin);
  };

  useEffect(() => {
    getWillBeAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation();
      return;
    }

    if (isSending) {
      toast.error("Inscription déjà en cours..");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Les mots de passe doivent être identiques");
      return;
    }

    if (password.length < 8) {
      toast.warning("Votre mot de passe doit être d'au moins 8 caractères");
      return;
    }

    setIsSending(true);

    const apiCall = api
      .fetch("register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          univUsername: username,
          password,
        }),
      })
      .then((res) => {
        if (res.status !== "success") {
          throw res.error;
        }

        const { email, univUsername, admin } = res;
        const token = res.access_token;
        signup(email, univUsername, token, admin);

        router.push("/");
      })
      .catch(async (e) => {
        try {
          const json = await e.json();
          if (
            json.error ==
            'error: duplicate key value violates unique constraint "users_email_key"'
          ) {
            throw "Email déjà utilisé";
          } else if (json.error == "Cannot have multiple users") {
            throw "Impossible d'avoir plusieurs comptes, veuillez contacter l'administrateur";
          } else {
            console.error(e);
            throw "Echec, veuillez ressayer";
          }
        } catch (e) {
          throw "Echec, veuillez ressayer";
        }
      })
      .finally(() => {
        setIsSending(false);
      });
    await toast.promise(apiCall, {
      pending: "Inscription en cours..",
      success: "Inscription réussie",
      error: {
        render({ data }) {
          return data;
        },
      },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Créer un compte
        </Typography>
        {willBeAdmin ? (
          <Flash
            type={"success"}
            sx={{
              width: "100%",
              marginTop: "1rem",
            }}
          >
            Ce compte sera le compte principal (admin)
          </Flash>
        ) : (
          <></>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Addresse email"
                name="email"
                autoComplete="email"
                type={"email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Url de l'emploi du temps"
                name="username"
                autoComplete="username"
                type={"text"}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Confirmer votre mot de passe"
                type="password"
                id="passwordConfirm"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            S'inscrire
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin">
                <Typography variant="body2" component={"a"}>
                  Vous possedez déjà un compte? Se connecter
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
