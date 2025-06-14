export type AssetInfoType = {
  asset: {
    certificateId: string;
    isActive: boolean;
    purity: BigInt;
    vaultLocation: string;
    weight: BigInt;
  };

  tokenId: BigInt;
  tokenURI: string;
};
