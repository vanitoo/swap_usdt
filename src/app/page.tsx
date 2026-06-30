import { SwapCard } from "@/components/swap-card";

const features = [
  ["Без хранения средств", "Пользователь подтверждает операции только в своем кошельке."],
  ["Одна простая задача", "Только USDT ↔ USDC на старте, без лишнего комбайна."],
  ["Готово к развитию", "Позже можно добавить Li.Fi, 1inch, комиссии и другие сети."],
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-5 py-8 text-white md:px-10">
      <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute bottom-[-18rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between py-4">
        <div className="text-xl font-black tracking-tight">StableSwap</div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">MVP on Base</div>
      </header>
      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_440px] md:items-center">
        <section className="py-8 md:py-20">
          <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">Non-custodial stablecoin swap MVP</div>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">USDT ↔ USDC без лишнего шума</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">Простой лендинг для быстрого обмена стейблкоинов в сети Base. Без регистрации, без хранения средств, без базы данных.</p>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-2xl font-bold">Base</div><div className="mt-1 text-sm text-white/50">первая сеть</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-2xl font-bold">2</div><div className="mt-1 text-sm text-white/50">токена</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-2xl font-bold">0</div><div className="mt-1 text-sm text-white/50">серверов для MVP</div></div>
          </div>
        </section>
        <div className="animate-float"><SwapCard /></div>
      </div>
      <section className="relative mx-auto mt-10 grid max-w-6xl gap-4 pb-16 md:grid-cols-3">
        {features.map(([title, text]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
