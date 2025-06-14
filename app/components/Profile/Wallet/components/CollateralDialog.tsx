import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slider,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import type { AssetType } from "~/types/asset.type";
import { useGoldPrice } from "~/utils/hooks/gold";

interface CollateralDialogProps {
  open: boolean;
  onClose: () => void;
  item: AssetType;
}

const CollateralDialog: React.FC<CollateralDialogProps> = ({
  open,
  onClose,
  item,
}) => {
  const goldPrice = useGoldPrice() ?? 0;
  const [partOfPrice, setPartOfPrice] = useState(70);
  const [loanTerm, setLoanTerm] = useState(4);
  const interestRate = 5;
  const assetPrice = goldPrice * item.weight;

  const loanAmount = (assetPrice * partOfPrice) / 100;
  const interest = (loanAmount * interestRate * loanTerm) / 100;
  const totalRepayment = loanAmount + interest;

  const handleSubmit = async () => {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Use Asset as Collateral</DialogTitle>
      <DialogContent>
        <Box mb={4}>
          <Alert severity="warning" icon={<div />}>
            <Typography fontWeight={500}>Asset Price:</Typography>
            <Typography variant="h6" fontWeight={600} my={1}>
              ${assetPrice.toFixed(2)}
            </Typography>
            <Typography variant="body2" className="opacity-50">
              Based on current gold price
            </Typography>
          </Alert>
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
            <Typography>Loan Amount:</Typography>${loanAmount.toFixed(2)}
          </div>
          <div className="flex justify-between">
            <Typography>Interest:</Typography>${interest.toFixed(2)}
          </div>
          <div className="flex justify-between">
            <Typography>Interest rate:</Typography>
            {interestRate}%
          </div>
          <div className="flex justify-between mt-4">
            <Typography fontWeight={600}>Total Repayment:</Typography>
            <Typography fontWeight={600}>
              ${totalRepayment.toFixed(2)}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollateralDialog;
