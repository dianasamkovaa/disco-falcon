import {useAccount, useDisconnect} from "wagmi";
import {useCallback, useEffect} from "react";
import {Button} from "@mui/material";
import {useNavigate} from "react-router";

export default function Home() {
  const {disconnect} = useDisconnect();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      disconnect();
      console.log('Successfully disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, [disconnect]);

    const { isConnected } = useAccount();

    useEffect(() => {
        if (!isConnected) {
            navigate('/login');
        }
    }, [isConnected, navigate]);


  return (
      <div className="flex gap-2">
        Home Page
        <Button onClick={handleLogout} >disconnect</Button>
      </div>
  );
}
