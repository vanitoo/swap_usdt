"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { DIRECTIONS, TokenSymbol } from "@/lib/tokens";

type Direction = { from: TokenSymbol; to: TokenSymbol; label: string };

function calc(amount: string, direction: Direction) {
  const value = Number(amount.replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) return "0.000000";
  const rate = direction.from === "USDT" ? 0.9996 : 0.9994;
  return (value * rate).toFixed(6);
}

export function SwapCard() {
  const [directionIndex, setDirectionIndex] = useState(0);
  const [amount, setAmount] = useState("100");
  const direction = DIRECTIONS[directionIndex];
  const estimated = useMemo(() => calc(amount, direction), [amount, direction]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-glow backdrop-blur-xl md:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-emerald-200/70">Base network</p>
          <h2 className="text-2xl font-semibold">Быстрый обмен</h2>
        </div>
        <ConnectButton />
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Направление</span>
          <select value={directionIndex} onChange={(e) => setDirectionIndex(Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none focus:border-emerald-300">
            {DIRECTIONS.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Отдаете</span>
          <div className="flex rounded-2xl border border-white/10 bg-black/40 focus-within:border-emerald-300">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="min-w-0 flex-1 bg-transparent px-4 py-4 text-2xl outline-none" placeholder="0.00" />
            <div className="flex items-center px-4 text-lg font-semibold text-emerald-200">{direction.from}</div>
          </div>
        </label>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <div className="text-sm text-emerald-100/70">Предварительно получите</div>
          <div className="mt-1 text-3xl font-bold">{estimated} {direction.to}</div>
          <div className="mt-2 text-xs text-white/50">Демо-расчет. Реальный маршрут swap подключается следующим этапом.</div>
        </div>
        <button type="button" className="w-full rounded-2xl bg-emerald-300 px-5 py-4 font-bold text-black transition hover:bg-emerald-200">Подключить реальный swap</button>
      </div>
    </section>
  );
}
