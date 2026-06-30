import { BASE_CHAIN_ID_DEC, INTEGRATOR, LIFI_KEY, TOKENS } from "./config.js";

export function getDirection(directionValue) {
  if (directionValue === "USDC-USDT") {
    return { from: "USDC", to: "USDT" };
  }
  return { from: "USDT", to: "USDC" };
}

export function parseAmount(value) {
  const amount = Number(String(value).replace(",", "."));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function toUnits(amount, decimals) {
  return BigInt(Math.round(amount * Math.pow(10, decimals))).toString();
}

export function fromUnits(value, decimals) {
  const raw = String(value || "0").padStart(decimals + 1, "0");
  const whole = raw.slice(0, -decimals);
  const fraction = raw.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

export function isLifiConfigured() {
  return Boolean(LIFI_KEY && LIFI_KEY !== "PASTE_LIFI_KEY_HERE");
}

export async function getQuote({ directionValue, amount, fromAddress }) {
  if (!isLifiConfigured()) {
    throw new Error("В js/config.js нужно вставить LI.FI ключ в LIFI_KEY.");
  }

  const direction = getDirection(directionValue);
  const fromToken = TOKENS[direction.from];
  const toToken = TOKENS[direction.to];

  const params = new URLSearchParams({
    fromChain: String(BASE_CHAIN_ID_DEC),
    toChain: String(BASE_CHAIN_ID_DEC),
    fromToken: fromToken.address,
    toToken: toToken.address,
    fromAmount: toUnits(amount, fromToken.decimals),
    fromAddress,
    integrator: INTEGRATOR,
    slippage: "0.005",
  });

  const response = await fetch(`https://li.quest/v1/quote?${params.toString()}`, {
    headers: {
      "x-lifi-api-key": LIFI_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "LI.FI не вернул котировку.");
  }

  return {
    raw: data,
    direction,
    toAmount: data.estimate?.toAmount ? fromUnits(data.estimate.toAmount, toToken.decimals) : "—",
    transactionRequest: data.transactionRequest,
  };
}
