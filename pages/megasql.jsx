import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Megasql = () => {
  const router = useRouter();
  const { token, initialized } = useAuth();

  useEffect(() => {
    if (initialized && !token) {
      router.push("/signin");
    }
  }, [token, initialized]);

  return <Typography>Megasql</Typography>;
};

export default Megasql;
