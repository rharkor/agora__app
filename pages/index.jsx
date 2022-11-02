import { Card, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

import logo from "../res/logo.svg";
import calendar from "../res/calendar.svg";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { token, initialized } = useAuth();

  useEffect(() => {
    if (initialized && !token) {
      router.push("/signin");
    }
  }, [token, initialized]);

  const goToCalendar = () => {
    router.push("/calendar");
  };

  return (
    <Container
      component={"main"}
      maxWidth="xl"
      sx={{
        marginTop: "1rem",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Image src={logo} alt="logo" height={150} width={150} />
        <Typography component="h1" variant="h3">
          Agora
        </Typography>
      </header>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        <Card
          component={"article"}
          sx={{
            padding: "1rem",
            borderRadius: "5px",
            flex: "1",
            maxWidth: "350px",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={goToCalendar}
        >
          <Image src={calendar} alt="calendar" height={75} width={75} />
          <Typography component="h2" variant="h4">
            Calendrier
          </Typography>
        </Card>
      </section>
    </Container>
  );
}
