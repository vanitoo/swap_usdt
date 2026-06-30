const APP_VERSION = "v1.0.1";
const BASE_CHAIN_ID_HEX = "0x2105";
const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

let account = null;
let isBase = false;

const $ = (id) => document.getElementById(id);

const ui = {
  versionTop: $("versionTop"),
  versionBottom: $("versionBottom"),
  direction: $("direction"),
  amount: $("amount"),
  fromToken: $("fromToken"),
  toToken: $("toToken"),
  receiveAmount: $("receiveAmount"),
  quoteInfo: $("quoteInfo"),
  mainBtn: $("mainBtn"),
  switchBtn: $("switchBtn"),
  networkBadge: $("networkBadge"),
  walletStatus: $("walletStatus"),
  walletBox: $("walletBox"),
  walletAddress: $("walletAddress"),
  walletNetwork: $("walletNetwork"),
  walletEth: $("walletEth"),
  walletProvider: $("walletProvider"),
};

function provider() {
  if (window.ethereum) return window.ethereum;
  return null;
}

function shortAddress(address) {
  return address ? address.slice(0, 6) + "..." + address.slice(-4) : "";
}

function setStatus(text, type = "") {
  ui.walletStatus.className = ("status-box " + type).trim();
  ui.walletStatus.textContent = text;
}

function setInfo(text, type = "") {
  ui.quoteInfo.className = ("info-box " + type).trim();
  ui.quoteInfo.textContent = text;
}

function setMainButton(text, disabled = false) {
  ui.mainBtn.textContent = text;
  ui.mainBtn.disabled = disabled;
}

function providerName() {
  const p = provider();
  if (!p) return "нет";
  if (p.isRabby) return "Rabby";
  if (p.isMetaMask) return "MetaMask";
  if (p.isTrust) return "Trust Wallet";
  return "EVM wallet";
}

function ethFromWei(hex) {
  try {
    return (Number(BigInt(hex)) / 1e18).toFixed(6) + " ETH";
  } catch (e) {
    return "—";
  }
}

function getDirection() {
  return ui.direction.value === "USDC-USDT"
    ? { from: "USDC", to: "USDT", rate: 0.9994 }
    : { from: "USDT", to: "USDC", rate: 0.9996 };
}

function updateEstimate() {
  const direction = getDirection();
  ui.fromToken.textContent = direction.from;
  ui.toToken.textContent = direction.to;

  const amount = Number(String(ui.amount.value).replace(",", "."));
  ui.receiveAmount.textContent = Number.isFinite(amount) && amount > 0
    ? (amount * direction.rate).toFixed(6)
    : "—";
}

async function getChainId() {
  const p = provider();
  if (!p) return null;
  return p.request({ method: "eth_chainId" });
}

async function updateWalletInfo() {
  const p = provider();
  if (!p || !account) {
    ui.walletBox.classList.add("hidden");
    return;
  }

  ui.walletBox.classList.remove("hidden");
  ui.walletAddress.textContent = account;
  ui.walletProvider.textContent = providerName();

  try {
    const chainId = await getChainId();
    isBase = chainId === BASE_CHAIN_ID_HEX;

    ui.networkBadge.textContent = isBase ? "Base" : "Wrong network";
    ui.switchBtn.classList.toggle("hidden", isBase);
    ui.walletNetwork.textContent = isBase ? "Base" : "Chain " + parseInt(chainId, 16);

    const balance = await p.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    ui.walletEth.textContent = ethFromWei(balance);

    if (isBase) {
      setStatus("Кошелек подключен: " + shortAddress(account) + " · Base", "ok");
      setInfo("Кошелек подключен. Следующий шаг — включить реальный LI.FI swap.", "ok");
      setMainButton("Получить курс");
    } else {
      setStatus("Кошелек подключен: " + shortAddress(account) + " · переключите сеть на Base", "bad");
      setInfo("Для обмена нужна сеть Base.", "bad");
      setMainButton("Переключить на Base");
    }
  } catch (error) {
    setStatus(error.message || "Не удалось прочитать данные кошелька.", "bad");
  }
}

async function connectWallet() {
  try {
    const p = provider();
    if (!p) {
      setStatus("Кошелек не найден. Установите MetaMask/Rabby или откройте сайт во встроенном браузере кошелька.", "bad");
      return;
    }

    setMainButton("Подключение...", true);
    setStatus("Ожидаю подтверждение в кошельке...");

    const accounts = await p.request({ method: "eth_requestAccounts" });
    account = accounts && accounts.length ? accounts[0] : null;

    if (!account) {
      setStatus("Кошелек не вернул адрес. Разблокируйте кошелек и попробуйте снова.", "bad");
      setMainButton("Connect wallet");
      return;
    }

    await updateWalletInfo();
  } catch (error) {
    setStatus(error.message || "Подключение отменено.", "bad");
    setMainButton(account ? "Получить курс" : "Connect wallet");
  } finally {
    ui.mainBtn.disabled = false;
  }
}

async function switchToBase() {
  try {
    const p = provider();
    if (!p) throw new Error("Кошелек не найден.");

    await p.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });

    await updateWalletInfo();
  } catch (error) {
    if (error && error.code === 4902) {
      try {
        await provider().request({
          method: "wallet_addEthereumChain",
          params: [BASE_CHAIN_PARAMS],
        });
        await updateWalletInfo();
        return;
      } catch (addError) {
        setStatus(addError.message || "Не удалось добавить Base.", "bad");
        return;
      }
    }
    setStatus(error.message || "Не удалось переключить сеть.", "bad");
  }
}

function mainAction() {
  if (!account) return connectWallet();
  if (!isBase) return switchToBase();
  setInfo("Кошелек подключен. Реальный LI.FI swap подключим следующим шагом после проверки подключения.", "ok");
}

function bindEvents() {
  document.querySelectorAll("[data-connect-wallet]").forEach((button) => {
    button.addEventListener("click", connectWallet);
  });

  document.querySelectorAll("[data-scroll-to-swap]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#swap").scrollIntoView({ behavior: "smooth" });
    });
  });

  ui.mainBtn.addEventListener("click", mainAction);
  ui.switchBtn.addEventListener("click", switchToBase);
  ui.direction.addEventListener("change", updateEstimate);
  ui.amount.addEventListener("input", updateEstimate);

  const p = provider();
  if (p && typeof p.on === "function") {
    p.on("accountsChanged", async (accounts) => {
      account = accounts && accounts.length ? accounts[0] : null;
      if (!account) {
        setStatus("Кошелек не подключен.");
        setMainButton("Connect wallet");
        ui.walletBox.classList.add("hidden");
        return;
      }
      await updateWalletInfo();
    });

    p.on("chainChanged", async () => {
      await updateWalletInfo();
    });
  }
}

function init() {
  ui.versionTop.textContent = APP_VERSION;
  ui.versionBottom.textContent = APP_VERSION;
  updateEstimate();
  setMainButton("Connect wallet");
  bindEvents();
}

init();
