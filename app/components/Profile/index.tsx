import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import TokeniseAssetDialog from "./components/TokeniseAssetDialog";
import Wallet from "~/components/Profile/Wallet";
import AddIcon from "@mui/icons-material/Add";
import { useGetNfts } from "~/utils/hooks/gold";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CollateralAssets from "~/components/Profile/CollateralAssets";

export default function Profile() {
  const { refetch } = useGetNfts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = React.useState("my-assets");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      refetch(); // ← обновляем список через 1-2 секунды
    }, 1500);
  };

  return (
    <div className="px-40">
      <div className="flex items-start justify-between">
        <div>
          <Typography mb={2} variant="h4">
            My Assets
          </Typography>
          <div>
            Manage and tokenize your physical assets for collateral lending
          </div>
        </div>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          size="large"
          onClick={handleOpenDialog}
        >
          Tokenise Asset
        </Button>
      </div>
      <TokeniseAssetDialog open={dialogOpen} onClose={handleCloseDialog} />
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ mt: 3 }}
      >
        <Tab value="my-assets" label="My Assets" />
        <Tab value="collateral" label="Collateral Assets" />
      </Tabs>
      {value === "my-assets" && <Wallet />}
      {value === "collateral" && <CollateralAssets />}
    </div>
  );
}
