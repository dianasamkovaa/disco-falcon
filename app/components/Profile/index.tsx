import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import TokeniseAssetDialog from "./components/TokeniseAssetDialog";
import Wallet from "~/components/Profile/Wallet";
import AddIcon from "@mui/icons-material/Add";

export default function Profile() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
      <div></div>
      <TokeniseAssetDialog open={dialogOpen} onClose={handleCloseDialog} />
      <Wallet />
    </div>
  );
}
