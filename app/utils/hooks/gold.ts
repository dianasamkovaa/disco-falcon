import { useEffect, useState } from "react";
// import { RedstoneOracle } from "@redstone-finance/oracles";

export const useGoldPrice = () => {
  const [goldPrice, setGoldPrice] = useState<number | null>(0);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        // const price = await RedstoneOracle.getPrice("XAU"); // XAU = Gold
        // setGoldPrice(price.value);
      } catch (err) {
        console.error("Error fetching gold price:", err);
      }
    };

    fetchGoldPrice();
  }, []);

  return goldPrice;
};
