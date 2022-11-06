import { Card, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import logo from "../res/logo.svg";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

import calendar from "../res/calendar.svg";
import megasql from "../res/megasql.svg";

export default function Home() {
  const router = useRouter();
  const { token, initialized } = useAuth();
  const [access, setAccess] = useState([]);

  useEffect(() => {
    if (initialized && !token) {
      router.push("/signin");
    } else if (initialized && token) {
      getListOfAccess();
    }
  }, [token, initialized]);

  const getListOfAccess = async () => {
    try {
      const resp = await api.fetch("access/get");
      setAccess(resp.access);
    } catch (e) {
      console.error(e);
      toast.error("Une erreure est survenue lors de la récupération des accès");
    }
  };

  const goToCalendar = () => {
    router.push("/calendar");
  };

  const goToMegasql = () => {
    router.push("/megasql");
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
        <div
          style={{
            height: "auto",
            width: "150px",
            maxWidth: "25vw",
          }}
        >
          <Image src={logo} alt="logo" />
        </div>
        <Typography component="h1" variant="h3">
          Agora
        </Typography>
      </header>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "2rem",
          gap: "2rem",
        }}
      >
        {access.map((acc) => {
          if (acc === "calendar") {
            return (
              <Card
                component={"article"}
                key={acc}
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
            );
          } else if (acc === "megasql") {
            return (
              <Card
                component={"article"}
                key={acc}
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
                onClick={goToMegasql}
              >
                <Image src={megasql} alt="megasql" height={75} width={75} />
                <Typography component="h2" variant="h4">
                  Megasql
                </Typography>
              </Card>
            );
          }
        })}
      </section>
    </Container>
  );
}
