# Swap USDT ↔ USDC

Полный frontend-MVP для GitHub Pages.

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Публикация

1. Залить файлы в репозиторий `vanitoo/swap_usdt`.
2. В GitHub открыть `Settings → Pages`.
3. Выбрать `Source: GitHub Actions`.
4. Проверить `Actions → Deploy to GitHub Pages`.

Сайт будет доступен:

```text
https://vanitoo.github.io/swap_usdt/
```

## Важно

Не добавляй в репозиторий `.env.local`, seed phrase, private key, API secret.
