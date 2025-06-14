import React, { useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slider,
  Typography,
} from "@mui/material";
import type { AssetType } from "~/types/asset.type";
import { useGoldPrice } from "~/utils/hooks/gold";
import config from "~/config";
import RWALendingAbi from "~/abi/RWALending.json";
import { useWriteContract } from "wagmi";
import { WAGMIPublicClient } from "~/utils/config";

interface CollateralDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  item: AssetType;
}

const CollateralDialog: React.FC<CollateralDialogProps> = ({
  open,
  onClose,
  item,
  refetch,
}) => {
  const { goldPrice = 0, isLoading, error } = useGoldPrice();
  const [partOfPrice, setPartOfPrice] = useState(70);
  const [loanTerm, setLoanTerm] = useState(4);
  const interestRate = 5;
  const assetPrice = (goldPrice ?? 0) * item.weight;

  const loanAmount = (assetPrice * partOfPrice) / 100;
  const interest = (loanAmount * interestRate * loanTerm) / 100;
  const totalRepayment = loanAmount + interest;

  const { writeContractAsync } = useWriteContract();
  const [loanStatus, setLoanStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [loanError, setLoanError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const isLoadingLoan = loanStatus === "pending";

  const handleSubmit = useCallback(async () => {
    setLoanStatus("pending");
    setLoanError(null);
    setTxHash(null);

    try {
      const tx = await writeContractAsync({
        address: config.RWA_LENDING_ADDRESS,
        abi: RWALendingAbi,
        functionName: "createLoan",
        args: [item.id],
      });

      const hash = typeof tx === "string" ? tx : (tx as any)?.hash;
      setTxHash(hash);

      // Ждём подтверждения в блокчейне
      await WAGMIPublicClient.waitForTransactionReceipt({ hash });

      setLoanStatus("success");

      refetch();

      // Автоматическое закрытие через 1.5 сек
      setTimeout(() => {
        onClose();
        setLoanStatus("idle");
        setTxHash(null);
      }, 1500);
    } catch (err) {
      console.error("Loan creation failed:", err);
      setLoanError(err as Error);
      setLoanStatus("error");
    }
  }, [item.id, writeContractAsync, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Use Asset as Collateral</DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          {error ? (
            <Alert severity="error">{error.message}</Alert>
          ) : isLoading ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography>Fetching gold price...</Typography>
            </Box>
          ) : (
            <Box>
              <Typography fontWeight={500}>Asset Price:</Typography>
              <Typography variant="h6" fontWeight={600} my={1}>
                ${assetPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" className="opacity-50">
                Based on current gold price
              </Typography>
            </Box>
          )}
        </Box>

        <Box mb={2}>
          <div className="flex justify-between">
            <Typography gutterBottom>Collateral amount</Typography>
            <Typography color="info">{partOfPrice} %</Typography>
          </div>
          <Slider
            value={partOfPrice}
            onChange={(e, value) => setPartOfPrice(value as number)}
            valueLabelDisplay="auto"
            min={10}
            max={70}
          />
        </Box>

        <Box mb={2}>
          <div className="flex justify-between">
            <Typography gutterBottom>Loan Term</Typography>
            <Typography color="info">{loanTerm} weeks </Typography>
          </div>
          <Slider
            value={loanTerm}
            onChange={(e, value) => setLoanTerm(value as number)}
            valueLabelDisplay="auto"
            min={1}
            max={12}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <Typography>Loan Amount:</Typography>
            <Typography>${loanAmount.toFixed(2)}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography>Interest:</Typography>
            <Typography>${interest.toFixed(2)}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography>Interest rate:</Typography>
            <Typography>{interestRate}%</Typography>
          </div>
          <div className="flex justify-between mt-4">
            <Typography fontWeight={600}>Total Repayment:</Typography>
            <Typography fontWeight={600}>
              ${totalRepayment.toFixed(2)}
            </Typography>
          </div>
        </div>

        {loanError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {loanError.message}
          </Alert>
        )}

        {txHash && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Tx Sent: <br />
            <Typography variant="body2" className="break-all">
              {txHash}
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoadingLoan || isLoading || !!error}
        >
          {isLoadingLoan ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollateralDialog;
