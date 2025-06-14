import { useAccount, useDisconnect } from "wagmi";
import { useCallback, useEffect } from "react";
import { Button, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router";
import Profile from "~/components/Profile";

export default function Home() {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      disconnect();
      console.log("Successfully disconnected");
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }, [disconnect]);

  return (
    <div className="pt-15">
      <Profile />
    </div>
  );
}
