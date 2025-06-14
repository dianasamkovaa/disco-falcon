import type { AssetType } from "~/types/asset.type";
import React, { type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import coin from "~/icons/coin.png";
import { Button } from "@mui/material";

const getAssetIcon = (type: AssetType["type"]) => {
  switch (type) {
    case "gold":
      return () => (
        <img
          src={coin}
          alt="gold accet"
          style={{ width: "32px", height: "32px" }}
        />
      );
  }
};

const WalletItem: FC<{ item: AssetType }> = ({ item }) => {
  const { type, weight, purity, certificate } = item;

  const Icon = getAssetIcon(type);

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
        <div>
          <Typography fontWeight={600} textTransform="capitalize">
            {type} Asset
          </Typography>
          <Typography variant="body2">
            <span className="opacity-90">Certificate:</span> {certificate}
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

      <div className="flex gap-3 mt-4">
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          className="flex-1"
        >
          Detail
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          className="flex-1"
        >
          Use as collateral
        </Button>
      </div>
    </Box>
  );
};

export default WalletItem;
