import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";

import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { signin } = useAuth();

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity() || isSending) {
      e.stopPropagation();
      return;
    }

    setIsSending(true);

    const apiCall = api
      .fetch("login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      .then((res) => {
        if (res.status !== "success") {
          throw res.error;
        }

        const { email, univUsername, admin } = res;
        const token = res.access_token;
        signin(email, univUsername, token, admin);

        router.push("/");
      })
      .catch(async (e) => {
        try {
          const json = await e.json();

          if ((json.error = "No match")) {
            throw "Email ou mot de passe incorrect";
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
      pending: "Connexion en cours..",
      success: "Connexion réussie",
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
          Se connecter
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Addresse email"
            name="email"
            autoComplete="email"
            type={"email"}
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Connexion
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup">
                <Typography variant="body2" component={"a"}>
                  Pas encore de compte? S'inscrire
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;
