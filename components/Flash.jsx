import { Alert, AlertTitle } from "@mui/material";

const Flash = ({ children, type, title, ...props }) => {
  return (
    <Alert severity={type} {...props}>
      {title ? <AlertTitle>{title}</AlertTitle> : <></>}
      {children}
    </Alert>
  );
};

export default Flash;
