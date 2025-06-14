import WalletItem from "~/components/Profile/Wallet/components/Item";
import { useGetLoans } from "~/utils/hooks/gold";
import CircularProgress from "@mui/material/CircularProgress";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import config from "~/config";
import ERC20Abi from "~/abi/ERC20.json";
import { useEffect, useState } from "react";

const CollateralAssets = () => {
  const { address } = useAccount();
  const { data, status, error, refetch } = useGetLoans();
  const { writeContractAsync } = useWriteContract();

  const { data: allowance } = useReadContract({
    address: config.STABLE_COIN_ADDRESS,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address ? [address, config.RWA_LENDING_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<Error | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (typeof allowance === "bigint") {
      setIsApproved(allowance > 0n);
    }
  }, [allowance]);

  const handleApprove = async () => {
    setIsApproving(true);
    setApproveError(null);

    try {
      await writeContractAsync({
        address: config.STABLE_COIN_ADDRESS,
        abi: ERC20Abi,
        functionName: "approve",
        args: [config.RWA_LENDING_ADDRESS, 2n ** 256n - 1n],
      });

      setIsApproved(true);
    } catch (err) {
      console.error("Approve failed", err);
      setApproveError(err as Error);
    } finally {
      setIsApproving(false);
    }
  };

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-gray-400">
        <CircularProgress size={32} />
        <p className="text-sm mt-3">Loading your NFTs...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-red-500">
        <WarningAmberIcon sx={{ fontSize: 32 }} />
        <p className="text-sm font-medium mt-2">Failed to load NFTs</p>
        <p className="text-xs text-center max-w-xs text-gray-400 mt-1">
          {error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-gray-400">
        <FolderOffIcon sx={{ fontSize: 32 }} />
        <p className="text-sm mt-2">No tokenized assets found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-12">
      {!isApproved && (
        <div className="mb-4">
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={isApproving}
            startIcon={isApproving ? <CircularProgress size={18} /> : null}
          >
            {isApproving ? "Approving Stablecoin..." : "Approve Stablecoin"}
          </Button>
          {approveError && (
            <p className="text-sm text-red-500 mt-1">{approveError.message}</p>
          )}
        </div>
      )}

      {isApproved && (
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <CheckIcon fontSize="small" />
          <span className="text-sm">Stablecoin transfer approved</span>
        </div>
      )}

      <div className="flex gap-6 flex-wrap">
        {data.map((item) => (
          <WalletItem
            key={item.id}
            item={item}
            isCollateral
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default CollateralAssets;
