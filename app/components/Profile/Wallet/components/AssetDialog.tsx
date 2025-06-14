import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface AssetDialogProps {
  open: boolean;
  onClose: () => void;
  asset: {
    goldWeight: string;
    purity: string;
    certificateNumber: string;
    storageLocation: string;
  };
}

export default function AssetDialog({
  open,
  onClose,
  asset,
}: AssetDialogProps) {
  const { goldWeight, purity, certificateNumber, storageLocation } = asset;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asset Information</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Gold Weight (grams):</strong> {goldWeight}
        </Typography>
        <Typography variant="body1">
          <strong>Purity:</strong> {purity}
        </Typography>
        <Typography variant="body1">
          <strong>Certificate Number:</strong> {certificateNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Storage Location:</strong> {storageLocation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
