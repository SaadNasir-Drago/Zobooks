// OfferDialog.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface OfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSendOffer: () => void;
  newMessage: string;
  setNewMessage: (value: string) => void;
}

const OfferDialog: React.FC<OfferDialogProps> = ({
  open,
  onClose,
  onSendOffer,
  newMessage,
  setNewMessage,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make an Offer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Offer Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          InputProps={{
            startAdornment: "$",
          }}
          
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSendOffer}
          variant="contained">
          Send Offer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferDialog;
