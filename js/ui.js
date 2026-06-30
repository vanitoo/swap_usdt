import { APP_VERSION } from "./config.js";

export const el = {
  versionTop: document.querySelector("#versionTop"),
  versionBottom: document.querySelector("#versionBottom"),
  direction: document.querySelector("#direction"),
  amount: document.querySelector("#amount"),
  fromToken: document.querySelector("#fromToken"),
  toToken: document.querySelector("#toToken"),
  receiveAmount: document.querySelector("#receiveAmount"),
  quoteInfo: document.querySelector("#quoteInfo"),
  mainBtn: document.querySelector("#mainBtn"),
  switchBtn: document.querySelector("#switchBtn"),
  networkBadge: document.querySelector("#networkBadge"),
  walletStatus: document.querySelector("#walletStatus"),
  walletBox: document.querySelector("#walletBox"),
  walletAddress: document.querySelector("#walletAddress"),
  walletNetwork: document.querySelector("#walletNetwork"),
  walletEth: document.querySelector("#walletEth"),
  walletProvider: document.querySelector("#walletProvider"),
};

export function initVersion() {
  el.versionTop.textContent = APP_VERSION;
  el.versionBottom.textContent = APP_VERSION;
}

export function setStatus(text, type = "") {
  el.walletStatus.className = `status-box ${type}`.trim();
  el.walletStatus.textContent = text;
}

export function setQuoteInfo(text, type = "") {
  el.quoteInfo.className = `info-box ${type}`.trim();
  el.quoteInfo.textContent = text;
}

export function setNetwork(isBase) {
  el.networkBadge.textContent = isBase ? "Base" : "Wrong network";
  el.switchBtn.classList.toggle("hidden", isBase);
}

export function setMainButton(text, disabled = false) {
  el.mainBtn.textContent = text;
  el.mainBtn.disabled = disabled;
}

export function setReceiveAmount(value) {
  el.receiveAmount.textContent = value || "—";
}

export function setTokens(from, to) {
  el.fromToken.textContent = from;
  el.toToken.textContent = to;
}

export function showWalletInfo(info) {
  if (!info) {
    el.walletBox.classList.add("hidden");
    return;
  }

  el.walletBox.classList.remove("hidden");
  el.walletAddress.textContent = info.account;
  el.walletNetwork.textContent = info.networkName;
  el.walletEth.textContent = info.ethBalance;
  el.walletProvider.textContent = info.providerName;
}
