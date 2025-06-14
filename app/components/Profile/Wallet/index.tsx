import { useApproveTransferAssets, useGetNfts } from "~/utils/hooks/gold";
import CircularProgress from "@mui/material/CircularProgress";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import WalletItem from "~/components/Profile/Wallet/components/Item";

const Wallet = () => {
  const { data, status, error, refetch } = useGetNfts();
  const {
    isApproved,
    handleApprove,
    isLoading: isApproving,
    error: approveError,
  } = useApproveTransferAssets();

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
            {isApproving ? "Approving..." : "Approve Transfer"}
          </Button>
          {approveError && (
            <p className="text-sm text-red-500 mt-1">{approveError.message}</p>
          )}
        </div>
      )}

      {isApproved && (
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <CheckIcon fontSize="small" />
          <span className="text-sm">Transfer approved</span>
        </div>
      )}

      <div className="flex gap-6 flex-wrap">
        {data.map((item) => (
          <WalletItem
            key={item.id}
            item={item}
            refetch={refetch}
            disabled={!isApproved}
          />
        ))}
      </div>
    </div>
  );
};

export default Wallet;
