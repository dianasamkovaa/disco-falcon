const config = {
  PINATA_JWT_TOKEN: import.meta.env.VITE_PINATA_JWT_TOKEN || "",
  RWA_TOKEN_ADDRESS: import.meta.env.VITE_RWA_TOKEN_ADDRESS || "",
  RWA_TOKEN_FROM_BLOCK: 8546265n,
  RWA_LENDING_FROM_BLOCK: 8548002n,

  RWA_LENDING_ADDRESS: import.meta.env.VITE_RWA_LENDING_ADDRESS || "",
  STABLE_COIN_ADDRESS: import.meta.env.VITE_STABLE_COIN_ADDRESS || "",
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID) || 1,
};

export default config;
