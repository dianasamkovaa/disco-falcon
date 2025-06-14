import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useWriteContract } from "wagmi";
import abi from "~/abi/RWAtoken.json";

interface CreateNFTDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function TokeniseAssetDialog({
  open,
  onClose,
}: CreateNFTDialogProps) {
  const [goldWeight, setGoldWeight] = useState("");
  const [purity, setPurity] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  const { writeContract } = useWriteContract();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    writeContract({
      address: "0x1A49d8Fa0F7504CD11c9609Ac71B428FAF06fdda",
      abi,
      functionName: "tokenizeGold",
      chainId: 11155111, // Sepolia Testnet
      args: [
        goldWeight,
        purity,
        certificateNumber,
        storageLocation,
        "ipfs://bafybeihcv7mvyxze27p2x5ic3w26nro6kok26cs54be4xsq2xaif2qrkla",
      ],
    });

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
