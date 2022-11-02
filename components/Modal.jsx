import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Modal as MUIModal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
};

const Modal = ({ open, onClose, children }) => {
  return (
    <MUIModal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </MUIModal>
  );
};

export default Modal;
