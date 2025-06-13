import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface CreateNFTDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateNFTDialog({
  open,
  onClose,
}: CreateNFTDialogProps) {
  const [goldWeight, setGoldWeight] = useState("");
  const [purity, setPurity] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData: {
      goldWeight: string;
      purity: string;
      certificateNumber: string;
      storageLocation: string;
    } = {
      goldWeight,
      purity,
      certificateNumber,
      storageLocation,
    };
    console.log("Form Data:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Fill Gold Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Gold Weight (grams)"
            fullWidth
            required
            margin="normal"
            value={goldWeight}
            onChange={(e) => setGoldWeight(e.target.value)}
          />
          <TextField
            label="Purity"
            fullWidth
            required
            margin="normal"
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
          />
          <TextField
            label="Certificate Number"
            fullWidth
            required
            margin="normal"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
          />
          <TextField
            label="Storage Location"
            fullWidth
            required
            margin="normal"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
