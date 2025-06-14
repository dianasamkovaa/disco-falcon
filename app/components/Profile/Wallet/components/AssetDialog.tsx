import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { AssetType } from "~/types/asset.type";

interface AssetDialogProps {
  open: boolean;
  onClose: () => void;
  asset: AssetType;
}

export default function AssetDialog({
  open,
  onClose,
  asset,
}: AssetDialogProps) {
  const { weight, purity, certificate, storage } = asset;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asset Details</DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <div className="flex justify-between min-w-[250px]">
          <Typography>Gold Weight (grams):</Typography>
          <Typography>{weight}</Typography>
        </div>
        <div className="flex justify-between min-w-[250px]">
          <Typography>Purity:</Typography>
          <Typography>{purity}</Typography>
        </div>
        <div className="flex justify-between min-w-[250px]">
          <Typography>Certificate Number:</Typography>
          <Typography>{certificate}</Typography>
        </div>
        <div className="flex justify-between min-w-[250px]">
          <Typography>Storage Location:</Typography>
          <Typography>{storage}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
