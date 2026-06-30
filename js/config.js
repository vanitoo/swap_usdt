export const APP_VERSION = "v1.0.0";

export const BASE_CHAIN_ID_HEX = "0x2105";
export const BASE_CHAIN_ID_DEC = 8453;

export const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

export const INTEGRATOR = "swap77";

// ЗАМЕНИ ЗНАЧЕНИЕ НИЖЕ НА КЛЮЧ LI.FI
export const LIFI_KEY = "PASTE_LIFI_KEY_HERE";

export const TOKENS = {
  USDC: { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
  USDT: { symbol: "USDT", address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6 },
};
