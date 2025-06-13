import { useAccount } from "wagmi";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

const RouterHandler = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/login" && isConnected) {
      navigate("/", { replace: true });
    }
    if (!isConnected && pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [isConnected, navigate]);

  return null;
};

export default RouterHandler;
