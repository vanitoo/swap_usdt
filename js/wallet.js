import { BASE_CHAIN_ID_HEX, BASE_CHAIN_PARAMS } from "./config.js";

export function getProvider() {
  return window.ethereum || null;
}

export function shortAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
}

export function getProviderName() {
  const provider = getProvider();
  if (!provider) return "нет";
  if (provider.isRabby) return "Rabby";
  if (provider.isMetaMask) return "MetaMask";
  if (provider.isTrust) return "Trust Wallet";
  return "EVM wallet";
}

export function ethFromWei(hexValue) {
  try {
    return (Number(BigInt(hexValue)) / 1e18).toFixed(6);
  } catch {
    return "—";
  }
}

export async function connectWallet() {
  const provider = getProvider();
  if (!provider) {
    throw new Error("Кошелек не найден. Установите MetaMask/Rabby или откройте сайт во встроенном браузере кошелька.");
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const account = accounts && accounts.length ? accounts[0] : null;

  if (!account) {
    throw new Error("Кошелек не вернул адрес. Разблокируйте кошелек и попробуйте снова.");
  }

  return account;
}

export async function getChainId() {
  const provider = getProvider();
  if (!provider) return null;
  return provider.request({ method: "eth_chainId" });
}

export async function isBaseNetwork() {
  const chainId = await getChainId();
  return chainId === BASE_CHAIN_ID_HEX;
}

export async function switchToBase() {
  const provider = getProvider();
  if (!provider) throw new Error("Кошелек не найден.");

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
  } catch (error) {
    if (error && error.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [BASE_CHAIN_PARAMS],
      });
      return;
    }
    throw error;
  }
}

export async function getWalletInfo(account) {
  const provider = getProvider();
  if (!provider || !account) return null;

  const chainId = await getChainId();
  const balanceHex = await provider.request({
    method: "eth_getBalance",
    params: [account, "latest"],
  });

  return {
    account,
    shortAccount: shortAddress(account),
    providerName: getProviderName(),
    chainId,
    networkName: chainId === BASE_CHAIN_ID_HEX ? "Base" : `Chain ${parseInt(chainId, 16)}`,
    ethBalance: `${ethFromWei(balanceHex)} ETH`,
    isBase: chainId === BASE_CHAIN_ID_HEX,
  };
}

export async function sendTransaction(transactionRequest, account) {
  const provider = getProvider();
  if (!provider) throw new Error("Кошелек не найден.");

  const request = {
    from: account,
    to: transactionRequest.to,
    data: transactionRequest.data,
    value: transactionRequest.value || "0x0",
  };

  if (transactionRequest.gasLimit || transactionRequest.gas) {
    request.gas = transactionRequest.gasLimit || transactionRequest.gas;
  }

  if (transactionRequest.gasPrice) {
    request.gasPrice = transactionRequest.gasPrice;
  }

  return provider.request({
    method: "eth_sendTransaction",
    params: [request],
  });
}
