# Старт проекта Swap USDT

## Концепция

MVP делаем максимально простым:

- только USDT и USDC;
- только одна сеть на старте: Base;
- без бэкенда;
- без базы;
- без хранения средств пользователей;
- обмен через кошелек пользователя.

## Текущий статус

Сделан первый frontend-каркас:

- Next.js App Router;
- TypeScript;
- Tailwind CSS;
- RainbowKit;
- Wagmi;
- Base network;
- лендинг;
- форма обмена;
- демо-расчет.

## Запуск локально

```bash
git clone https://github.com/vanitoo/swap_usdt.git
cd swap_usdt
npm install
cp .env.example .env.local
npm run dev
```

Открыть:

```text
http://localhost:3000
```

## WalletConnect

В `.env.local` надо указать:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Получить project id можно в WalletConnect Cloud.

## Что делать следующим этапом

1. Выбрать swap-провайдера: Uniswap, 1inch, Li.Fi или Odos.
2. Подключить реальный расчет маршрута.
3. Добавить approve токена.
4. Добавить отправку swap-транзакции.
5. Добавить страницу успешной операции.
6. Потом добавить комиссию сервиса, если провайдер поддерживает партнерский механизм.

## Важно

Репозиторий сейчас был обнаружен как public. Для приватности переключить вручную:

Settings → General → Danger Zone → Change repository visibility → Make private.
