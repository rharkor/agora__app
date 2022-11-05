import { Button, Container, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const SaveSnackbar = ({
  display,
  email,
  univUsername,
  password,
  multiAccount,
  setNewEmail,
  setNewPassword,
  setNewUnivUsername,
  setNewMultiAccount,
}) => {
  return (
    <Paper
      sx={{
        width: "100%",
        position: "fixed",
        bottom: "0",
        left: "0",
        marginTop: "2rem",
        padding: "0.5rem",
        transform: display ? "translateY(0)" : "translateY(100%)",
        transition: "all ease-in-out .3s",
      }}
      elevation={1}
    >
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Typography fontSize={"1.1rem"}>
          De nouvelles modifications ont été détectés. Voulez vous les
          sauvegarder ?
        </Typography>
        <Stack flexDirection={"row"} gap="1rem">
          <Button
            onClick={() => {
              setNewEmail(email);
              setNewUnivUsername(univUsername);
              setNewPassword(password);
              setNewMultiAccount(multiAccount);
            }}
          >
            Annuler
          </Button>
          <Button color="success" variant="contained" type="submit">
            Sauvegarder
          </Button>
        </Stack>
      </Container>
    </Paper>
  );
};

export default SaveSnackbar;
