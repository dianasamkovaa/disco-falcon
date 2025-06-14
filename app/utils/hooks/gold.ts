import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import config from "~/config";
import RWAtokenAbi from "~/abi/RWAtoken.json";
import RWALendingAbi from "~/abi/RWALending.json";
import type { AssetType } from "~/types/asset.type";
import type { AssetInfoType } from "~/types/assetInfo.type";
import { WAGMIPublicClient } from "~/utils/config";
import fetchLogsInChunks from "~/utils/fetcLogsInChunks";
import { formatUnits } from "viem";
import { mainnet } from "wagmi/chains";
import type { LoanedAssetType } from "~/types/loanedAsset.type";

const XAU_USD_ADDRESS = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";

const ABI = [
  {
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
    inputs: [],
  },
  {
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
    inputs: [],
  },
];

export const useGoldPrice = () => {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    data: roundData,
    status: roundStatus,
    error: roundError,
  } = useReadContract({
    abi: ABI,
    address: XAU_USD_ADDRESS,
    functionName: "latestRoundData",
    chainId: mainnet.id,
  });

  const {
    data: decimals,
    status: decimalsStatus,
    error: decimalsError,
  } = useReadContract({
    abi: ABI,
    address: XAU_USD_ADDRESS,
    functionName: "decimals",
    chainId: mainnet.id,
  });

  useEffect(() => {
    if (roundStatus === "success" && decimalsStatus === "success") {
      try {
        const rawPrice = (roundData as any)?.[1];
        const formatted = parseFloat(formatUnits(rawPrice, decimals as number));
        const pricePerGram = formatted / 31.1035;
        setGoldPrice(pricePerGram);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    } else if (roundStatus === "error" || decimalsStatus === "error") {
      setError(roundError || decimalsError || new Error("Unknown error"));
      setIsLoading(false);
    }
  }, [
    roundData,
    decimals,
    roundStatus,
    decimalsStatus,
    roundError,
    decimalsError,
  ]);

  return { goldPrice, isLoading, error };
};

export const useGetNfts = () => {
  const { address } = useAccount();

  const result = useReadContract({
    address: config.RWA_TOKEN_ADDRESS,
    abi: RWAtokenAbi,
    functionName: "getOwnerTokensInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const mappedData: AssetType[] = Array.isArray(result.data)
    ? result.data.map((item: AssetInfoType) => ({
        id: Number(item.tokenId),
        type: "gold",
        weight: Number(item.asset.weight),
        purity: Number(item.asset.purity),
        certificate: item.asset.certificateId,
        storage: item.asset.vaultLocation,
      }))
    : [];

  return {
    data: mappedData,
    status: result.status as "pending" | "success" | "error",
    error: result.error,
    refetch: result.refetch,
  };
};

export const useGetLoans = () => {
  const { address } = useAccount();
  const [data, setData] = useState<LoanedAssetType[]>([]);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!address) return;

    setStatus("pending");
    try {
      const [nftData, logs] = await Promise.all([
        WAGMIPublicClient.readContract({
          address: config.RWA_TOKEN_ADDRESS,
          abi: RWAtokenAbi,
          functionName: "getOwnerTokensInfo",
          args: [address],
        }),
        fetchLogsInChunks({
          client: WAGMIPublicClient,
          address: config.RWA_LENDING_ADDRESS,
          fromBlock: config.RWA_LENDING_FROM_BLOCK,
          abi: RWALendingAbi,
          eventName: "LoanCreated",
          args: { borrower: address },
        }),
      ]);

      const ownedTokenIds = new Set(
        Array.isArray(nftData)
          ? nftData.map((item: AssetInfoType) => Number(item.tokenId))
          : []
      );

      const tokenIdSet = new Set<number>();

      const loanPromises = logs
        .map(({ args }) => ({
          amount: Number(args.amount),
          collateralTokenId: Number(args.collateralTokenId),
          loanId: Number(args.loanId),
        }))
        .filter((loan) => !ownedTokenIds.has(loan.collateralTokenId))
        .filter((loan) => {
          if (tokenIdSet.has(loan.collateralTokenId)) return false;
          tokenIdSet.add(loan.collateralTokenId);
          return true;
        })
        .map(async (loan) => {
          const asset = (await WAGMIPublicClient.readContract({
            address: config.RWA_TOKEN_ADDRESS,
            abi: RWAtokenAbi,
            functionName: "getGoldAsset",
            args: [loan.collateralTokenId],
          })) as AssetInfoType["asset"];

          return {
            ...loan,
            id: Number(loan.collateralTokenId),
            weight: Number(asset.weight),
            purity: Number(asset.purity),
            certificateId: asset.certificateId,
            vaultLocation: asset.vaultLocation,
            type: "gold",
          };
        });

      const settled = await Promise.allSettled(loanPromises);
      const successfulLoans = settled
        .filter(
          (res): res is PromiseFulfilledResult<LoanedAssetType> =>
            res.status === "fulfilled" && res.value !== null
        )
        .map((res) => res.value);

      setData(successfulLoans);
      setStatus("success");
    } catch (err) {
      console.error("Error fetching loans:", err);
      setError(err as Error);
      setStatus("error");
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, status, error, refetch: fetchData };
};

export const useApproveTransferAssets = () => {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: approvedData, refetch } = useReadContract({
    address: config.RWA_TOKEN_ADDRESS,
    abi: RWAtokenAbi,
    functionName: "isApprovedForAll",
    args: address ? [address, config.RWA_LENDING_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (typeof approvedData === "boolean") {
      setIsApproved(approvedData);
    }
  }, [approvedData]);

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: config.CHAIN_ID,
    enabled: !!txHash,
    onSuccess: () => {
      setIsApproved(true);
    },
    onError: (err) => {
      setError(err);
    },
  });

  const handleApprove = useCallback(() => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);

      writeContract({
        address: config.RWA_TOKEN_ADDRESS,
        abi: RWAtokenAbi,
        functionName: "setApprovalForAll",
        args: [config.RWA_LENDING_ADDRESS, true],
      });
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [address, writeContract]);

  useEffect(() => {
    setIsLoading(isWriting || isConfirming);
  }, [isWriting, isConfirming]);

  return {
    isApproved,
    handleApprove,
    isLoading,
    error,
    refetchStatus: refetch,
  };
};
