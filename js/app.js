import { getDirection, getQuote, isLifiConfigured, parseAmount } from "./lifi.js";
import {
  connectWallet,
  getProvider,
  getWalletInfo,
  isBaseNetwork,
  sendTransaction,
  shortAddress,
  switchToBase,
} from "./wallet.js";
import {
  el,
  initVersion,
  setMainButton,
  setNetwork,
  setQuoteInfo,
  setReceiveAmount,
  setStatus,
  setTokens,
  showWalletInfo,
} from "./ui.js";

let account = null;
let isBase = false;
let currentQuote = null;
let quoteTimer = null;

function resetQuote() {
  currentQuote = null;
  setReceiveAmount("—");
  setMainButton(account ? "Получить курс" : "Connect wallet");
}

function syncTokens() {
  const direction = getDirection(el.direction.value);
  setTokens(direction.from, direction.to);
}

async function refreshWalletState({ autoQuote = false } = {}) {
  if (!account) {
    setStatus("Кошелек не подключен.");
    showWalletInfo(null);
    setNetwork(true);
    return;
  }

  isBase = await isBaseNetwork();
  setNetwork(isBase);

  const walletInfo = await getWalletInfo(account);
  showWalletInfo(walletInfo);

  if (isBase) {
    setStatus(`Кошелек подключен: ${shortAddress(account)} · Base`, "ok");
  } else {
    setStatus(`Кошелек подключен: ${shortAddress(account)} · переключите сеть на Base`, "bad");
  }

  if (autoQuote && isBase) {
    await requestQuote();
  }
}

async function onConnectWallet() {
  try {
    setStatus("Ожидаю подтверждение в кошельке...");
    account = await connectWallet();
    resetQuote();
    setQuoteInfo("Кошелек подключен. Теперь можно получить курс.", "ok");
    await refreshWalletState({ autoQuote: false });
  } catch (error) {
    setStatus(error.message || "Подключение отменено.", "bad");
  }
}

async function onSwitchToBase() {
  try {
    await switchToBase();
    resetQuote();
    setQuoteInfo("Сеть Base подключена. Теперь можно получить курс.", "ok");
    await refreshWalletState({ autoQuote: false });
  } catch (error) {
    setStatus(error.message || "Не удалось переключить сеть.", "bad");
  }
}

async function requestQuote() {
  try {
    if (!account) {
      await onConnectWallet();
      return;
    }

    if (!isBase) {
      setQuoteInfo("Сначала переключите кошелек на Base.", "bad");
      return;
    }

    if (!isLifiConfigured()) {
      setQuoteInfo("В js/config.js нужно заменить PASTE_LIFI_KEY_HERE на ключ LI.FI.", "bad");
      return;
    }

    const amount = parseAmount(el.amount.value);
    if (!amount) {
      setQuoteInfo("Введите сумму для обмена.", "bad");
      return;
    }

    setMainButton("Получаю курс...", true);
    setQuoteInfo("Получаю актуальный курс...");

    currentQuote = await getQuote({
      directionValue: el.direction.value,
      amount,
      fromAddress: account,
    });

    setReceiveAmount(currentQuote.toAmount);
    setMainButton("Обменять сейчас");
    setQuoteInfo("Курс получен. Проверьте сумму и подтвердите обмен в кошельке.", "ok");
  } catch (error) {
    currentQuote = null;
    setReceiveAmount("—");
    setMainButton("Получить курс");
    setQuoteInfo(error.message || "Не удалось получить курс.", "bad");
  } finally {
    el.mainBtn.disabled = false;
  }
}

async function executeSwap() {
  try {
    if (!currentQuote || !currentQuote.transactionRequest) {
      await requestQuote();
      return;
    }

    setStatus("Откройте кошелек и подтвердите транзакцию...", "ok");
    const txHash = await sendTransaction(currentQuote.transactionRequest, account);
    setStatus(`Транзакция отправлена: ${txHash}`, "ok");
    setQuoteInfo(`BaseScan: https://basescan.org/tx/${txHash}`, "ok");
    currentQuote = null;
    setMainButton("Получить новый курс");
  } catch (error) {
    setStatus(error.message || "Транзакция отменена.", "bad");
  }
}

async function mainAction() {
  if (!account) return onConnectWallet();
  if (!isBase) return onSwitchToBase();
  if (!currentQuote) return requestQuote();
  return executeSwap();
}

function onFormChange() {
  syncTokens();
  resetQuote();

  if (account && isBase) {
    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(requestQuote, 700);
  }
}

function bindEvents() {
  document.querySelectorAll("[data-connect-wallet]").forEach((button) => {
    button.addEventListener("click", onConnectWallet);
  });

  document.querySelectorAll("[data-scroll-to-swap]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#swap").scrollIntoView({ behavior: "smooth" });
    });
  });

  el.mainBtn.addEventListener("click", mainAction);
  el.switchBtn.addEventListener("click", onSwitchToBase);
  el.direction.addEventListener("change", onFormChange);
  el.amount.addEventListener("input", onFormChange);

  const provider = getProvider();
  if (provider) {
    provider.on("accountsChanged", async (accounts) => {
      account = accounts && accounts.length ? accounts[0] : null;
      resetQuote();
      await refreshWalletState({ autoQuote: false });
    });

    provider.on("chainChanged", async () => {
      resetQuote();
      await refreshWalletState({ autoQuote: false });
    });
  }
}

initVersion();
syncTokens();
resetQuote();
bindEvents();
