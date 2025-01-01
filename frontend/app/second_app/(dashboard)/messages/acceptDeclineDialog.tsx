// AcceptDeclineDialog.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { Message } from "@/types/types";

interface AcceptDeclineDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOffer: Message | null;
  handleAcceptOffer: () => void;
  handleDeclineOffer: () => void;
}

const AcceptDeclineDialog: React.FC<AcceptDeclineDialogProps> = ({
  open,
  onClose,
  selectedOffer,
  handleAcceptOffer,
  handleDeclineOffer,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Respond to Offer</DialogTitle>
      <DialogContent>
        {selectedOffer && (
          <Typography>
            Do you want to accept the offer of {selectedOffer.content}?
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeclineOffer} color="error">
          Decline
        </Button>
        <Button onClick={handleAcceptOffer} color="primary">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptDeclineDialog;
