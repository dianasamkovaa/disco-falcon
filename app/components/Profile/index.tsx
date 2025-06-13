import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import CreateNFTDialog from "./components/CreateNFTDialog";
import Wallet from "~/components/Profile/Wallet";

export default function Profile() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      <div>
        <Button onClick={handleOpenDialog}>Create NFT</Button>
      </div>
      <CreateNFTDialog open={dialogOpen} onClose={handleCloseDialog} />
      <Wallet />
    </div>
  );
}
