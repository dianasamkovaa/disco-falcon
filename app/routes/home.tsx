import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Profile from "~/components/Profile";
import LogoutIcon from "@mui/icons-material/Logout";
import { grey } from "@mui/material/colors";
import { formatUnits } from "viem";
import config from "~/config";
import { WAGMIPublicClient } from "~/utils/config";
import ERC20Abi from "~/abi/ERC20.json";

export default function Home() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;
    try {
      const [rawBalance, decimals] = await Promise.all([
        WAGMIPublicClient.readContract({
          address: config.STABLE_COIN_ADDRESS,
          abi: ERC20Abi,
          functionName: "balanceOf",
          args: [address],
        }),
        WAGMIPublicClient.readContract({
          address: config.STABLE_COIN_ADDRESS,
          abi: ERC20Abi,
          functionName: "decimals",
        }),
      ]);

      setBalance(formatUnits(rawBalance as bigint, decimals as number));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  const handleLogout = useCallback(() => {
    try {
      disconnect();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }, [disconnect]);

  return (
    <div className="pt-15">
      <Box
        sx={{ borderBottom: `${grey[900]} solid 1px` }}
        className="fixed top-0 left-0 w-full shadow-md py-2 px-20 flex items-center justify-end gap-4"
      >
        {balance !== null && (
          <Typography variant="body2" color="white">
            Balance:{" "}
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(Number(balance))}{" "}
            STB
          </Typography>
        )}

        <Avatar
          sx={{ width: 35, height: 35, mr: 2 }}
          src={ensAvatar ?? undefined}
        />

        <IconButton size="small" onClick={handleLogout}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
      <div className="pt-10">
        <Profile />
      </div>
    </div>
  );
}
