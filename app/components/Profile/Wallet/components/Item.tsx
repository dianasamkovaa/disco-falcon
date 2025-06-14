import type { AssetType } from "~/types/asset.type";
import React, { type FC, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import coin from "~/icons/coin.png";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import CollateralDialog from "~/components/Profile/Wallet/components/CollateralDialog";
import AssetDialog from "~/components/Profile/Wallet/components/AssetDialog";
import type { LoanedAssetType } from "~/types/loanedAsset.type";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import RWALendingAbi from "~/abi/RWALending.json";
import config from "~/config";
import { formatUnits } from "viem";

const getAssetIcon = (type: AssetType["type"]) => {
  switch (type) {
    case "gold":
      return () => (
        <img
          src={coin}
          alt="gold asset"
          style={{ width: "32px", height: "32px" }}
        />
      );
  }
};

const TxInfo: FC<{ txHash: string | null; txError: Error | null }> = ({
  txHash,
  txError,
}) => (
  <Box mt={2}>
    {txError && (
      <Alert severity="error" variant="filled">
        {txError.message}
      </Alert>
    )}
    {txHash && (
      <Alert
        severity="success"
        variant="outlined"
        sx={{ wordBreak: "break-all" }}
      >
        Tx sent:{" "}
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {txHash}
        </a>
      </Alert>
    )}
  </Box>
);

const useRepayLoan = (tokenId: number, refetch: () => void) => {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    isLoading: isWaiting,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
    confirmations: 1,
    query: {
      enabled: !!txHash,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setStatus("success");
      refetch();
      setShowSnackbar(true);
      setTimeout(() => {
        setStatus("idle");
        setTxHash(null);
        setTxError(null);
      }, 500);
    }

    if (isError) {
      setStatus("error");
    }
  }, [isSuccess, isError, refetch]);

  const repay = useCallback(async () => {
    setStatus("pending");
    setTxError(null);
    setTxHash(null);

    try {
      const tx = await writeContractAsync({
        address: config.RWA_LENDING_ADDRESS,
        abi: RWALendingAbi,
        functionName: "repayLoan",
        args: [tokenId],
      });

      const hash = typeof tx === "string" ? tx : (tx as any)?.hash;
      setTxHash(hash);
    } catch (err) {
      setTxError(err as Error);
      setStatus("error");
    }
  }, [tokenId, writeContractAsync]);

  return {
    repay,
    isLoading: status === "pending" || isWaiting,
    status,
    txError,
    txHash,
    showSnackbar,
    setShowSnackbar,
  };
};

const WalletItem: FC<{
  item: AssetType | LoanedAssetType;
  refetch: () => void;
  isCollateral?: boolean;
  disabled?: boolean;
}> = ({ item, isCollateral, refetch, disabled }) => {
  const { id, type, weight, purity } = item;
  const certificate = (item as AssetType)?.certificate;
  const amount = (item as LoanedAssetType)?.amount;

  const [collateralDialogOpen, setCollateralDialogOpen] = useState(false);
  const [detailDialogOpen, seDetailDialogOpen] = useState(false);

  const Icon = getAssetIcon(type);

  const {
    repay,
    isLoading,
    status,
    txError,
    txHash,
    showSnackbar,
    setShowSnackbar,
  } = useRepayLoan(id, refetch);

  return (
    <Box
      sx={{
        borderRadius: "12px",
        borderColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        p: 2,
        background: "#111827",
        cursor: "pointer",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Box className="flex gap-2 items-center mb-2">
        <Icon />
        <div className="w-full">
          <div className="flex justify-between w-full">
            <Typography fontWeight={600} textTransform="capitalize">
              {type} Asset
            </Typography>
            <div>
              {isCollateral ? (
                <Chip label="Collateral" color="error" variant="outlined" />
              ) : (
                <Chip label="Available" color="success" variant="outlined" />
              )}
            </div>
          </div>

          <Typography variant="body2">
            {certificate && (
              <>
                <span className="opacity-90">Certificate:</span> {certificate}
              </>
            )}
          </Typography>
        </div>
      </Box>

      <div className="flex justify-between mt-4">
        <Typography component="span" className="opacity-90">
          Weight
        </Typography>
        <Typography component="span">{weight} g</Typography>
      </div>
      <Box className="flex justify-between">
        <Typography component="span" className="opacity-90">
          Purity
        </Typography>
        <Typography component="span">{purity}</Typography>
      </Box>

      {isCollateral && (
        <Box className="flex justify-between">
          <Typography component="span" className="opacity-90">
            Loan Amount
          </Typography>
          <Typography component="span">
            {Number(formatUnits(BigInt(amount || 0), 18)).toFixed(4)} STB
          </Typography>
        </Box>
      )}

      <div className="flex gap-3 mt-4 justify-between">
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          className="flex-1"
          onClick={() => {
            seDetailDialogOpen(true);
          }}
        >
          Detail
        </Button>

        {isCollateral ? (
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="warning"
            className="flex-1"
            onClick={repay}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} /> : null}
          >
            {isLoading ? "Processing..." : "Make payment"}
          </Button>
        ) : (
          <Tooltip
            title={
              disabled ? "Approval required before using as collateral" : ""
            }
          >
            <span className="flex-1">
              <Button
                sx={{ textTransform: "none" }}
                variant="contained"
                className="w-full"
                onClick={() => {
                  setCollateralDialogOpen(true);
                }}
                disabled={disabled}
              >
                Use as collateral
              </Button>
            </span>
          </Tooltip>
        )}
      </div>

      <TxInfo txHash={txHash} txError={txError} />

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setShowSnackbar(false)}
        >
          Loan repaid successfully!
        </Alert>
      </Snackbar>

      {collateralDialogOpen && (
        <CollateralDialog
          item={item as AssetType}
          open={collateralDialogOpen}
          onClose={() => setCollateralDialogOpen(false)}
          refetch={refetch}
        />
      )}
      {detailDialogOpen && (
        <AssetDialog
          asset={item as AssetType}
          open={detailDialogOpen}
          onClose={() => seDetailDialogOpen(false)}
        />
      )}
    </Box>
  );
};

export default WalletItem;
