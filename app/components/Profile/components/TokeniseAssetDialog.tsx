import React, { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import abi from "~/abi/RWAtoken.json";
import config from "~/config";
import createMetadataURI from "~/components/Profile/components/createMetadata";
import { WAGMIConfig } from "~/utils/config";

interface CreateNFTDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoadingMessage = ({
  type,
}: {
  type: "ipfs" | "approval" | "waiting";
}) => {
  const messages: Record<string, string> = {
    ipfs: "Uploading data to IPFS...",
    approval: "Waiting for user confirmation...",
    waiting: "Minting in progress...",
  };

  return (
    <Alert severity="info" sx={{ mt: 2 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {messages[type]}
        <CircularProgress size={18} />
      </div>
    </Alert>
  );
};

export default function TokeniseAssetDialog({
  open,
  onClose,
}: CreateNFTDialogProps) {
  const { writeContractAsync } = useWriteContract();

  const [goldWeight, setGoldWeight] = useState("");
  const [purity, setPurity] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  const [loading, setLoading] = useState<
    "ipfs" | "approval" | "waiting" | false
  >(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setGoldWeight("");
    setPurity("");
    setCertificateNumber("");
    setStorageLocation("");
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!certificateNumber.trim()) {
      setError("Certificate number is required");
      return;
    }

    try {
      setLoading("ipfs");

      const uri = await createMetadataURI({
        weight: Number(goldWeight),
        purity: Number(purity),
        certificateNumber,
        storageLocation,
      });

      setLoading("approval");

      const txHash = await writeContractAsync({
        address: config.RWA_TOKEN_ADDRESS,
        abi,
        functionName: "tokenizeGold",
        chainId: config.CHAIN_ID,
        args: [
          BigInt(goldWeight),
          BigInt(purity),
          certificateNumber,
          storageLocation,
          uri,
        ],
      });

      setLoading("waiting");

      const receipt = await waitForTransactionReceipt(WAGMIConfig, {
        hash: txHash,
      });

      if (receipt.status === "success") {
        setSuccess(true);
        resetForm();
        onClose();
      } else {
        setError("Transaction reverted");
      }
    } catch (err: any) {
      console.error(err);
      if (err?.name === "UserRejectedRequestError") {
        setError("Transaction was cancelled by user");
      } else {
        setError(err?.shortMessage || err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Fill Gold Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Gold Weight (grams)"
            fullWidth
            required
            margin="normal"
            type="number"
            value={goldWeight}
            onChange={(e) => setGoldWeight(e.target.value)}
          />
          <TextField
            label="Purity"
            fullWidth
            required
            margin="normal"
            type="number"
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
          />
          <TextField
            label="Certificate Number"
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 50 }}
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

          {loading && <LoadingMessage type={loading} />}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Token successfully created!
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button
            onClick={handleClose}
            color="primary"
            disabled={loading !== false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading !== false}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
