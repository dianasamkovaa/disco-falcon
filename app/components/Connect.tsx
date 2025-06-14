import React from "react";
import { useConnect } from "wagmi";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import WalletIcon from "@mui/icons-material/Wallet";

const color: any = ["primary", "warning", "info", "primary"];

const Connect = () => {
  const { connectors, connect } = useConnect();

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <Paper
          className="flex max-w-[400px] shadow-lg"
          sx={{ borderRadius: "10%" }}
        >
          <div className="p-8 text-center rounded-lg">
            <WalletIcon fontSize="large" color="action" />
            <Typography variant="h5" mt={2} fontWeight={600}>
              Connect Your Wallet
            </Typography>
            <Typography my={3}>
              Connect your crypto wallet to start tokenizing your physical
              assets
            </Typography>
            <div className="mt-8">
              {connectors.map((connector, index) => (
                <div className="mb-3">
                  <Button
                    sx={{ minWidth: 200 }}
                    className="min-w-[200px]"
                    variant="contained"
                    color={color[index]}
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                  >
                    {connector.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default Connect;
