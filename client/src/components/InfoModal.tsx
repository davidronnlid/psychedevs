import { Info } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from "@mui/material";
import { useState } from "react";

interface InfoModalProps {
  title: string;
  bodyText: string;
  srcLink?: {
    text: string;
    url: string;
  };
}

const InfoModal: React.FC<InfoModalProps> = ({ title, bodyText, srcLink }) => {
  const [open, setOpen] = useState(false);

  // Function to handle opening the modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Info onClick={handleClickOpen} style={{ cursor: "pointer" }} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {bodyText}
            {srcLink && (
              <Link
                href={srcLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {srcLink.text}
              </Link>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoModal;
