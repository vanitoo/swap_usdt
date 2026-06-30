export type TokenSymbol = "USDT" | "USDC";

export type TokenConfig = {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  address: `0x${string}`;
};

// Base mainnet token addresses.
// Always verify before production launch.
export const BASE_TOKENS: Record<TokenSymbol, TokenConfig> = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  },
};

export const DIRECTIONS: Array<{ from: TokenSymbol; to: TokenSymbol; label: string }> = [
  { from: "USDT", to: "USDC", label: "USDT → USDC" },
  { from: "USDC", to: "USDT", label: "USDC → USDT" },
];
