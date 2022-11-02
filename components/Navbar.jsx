import Image from "next/image";

import Settings from "./Settings";
import logo from "../res/logo.svg";
import Link from "next/link";
import { Container } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { token, initialized } = useAuth();

  return (
    <Container
      component={"nav"}
      maxWidth="xl"
      style={{
        padding: "1rem",
      }}
    >
      <ul
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          margin: "0",
        }}
      >
        <li>
          <Link href={"/"}>
            <Image src={logo} alt="logo" width={38} height={38} priority />
          </Link>
        </li>
        {initialized && token ? (
          <li>
            <Settings />
          </li>
        ) : (
          <></>
        )}
      </ul>
    </Container>
  );
};

export default Navbar;
