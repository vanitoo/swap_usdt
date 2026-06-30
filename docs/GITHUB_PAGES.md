# Публикация на GitHub Pages

Проект уже подготовлен для публикации через GitHub Actions.

## 1. Включить GitHub Pages

В репозитории открыть:

```text
Settings → Pages
```

В блоке **Build and deployment** выбрать:

```text
Source: GitHub Actions
```

После этого каждый push в `main` будет запускать workflow `.github/workflows/pages.yml`.

## 2. Добавить WalletConnect Project ID

Открыть:

```text
Settings → Secrets and variables → Actions → New repository secret
```

Добавить секрет:

```text
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
```

Значение взять в WalletConnect Cloud.

Это frontend-переменная. Она попадет в собранный сайт, поэтому это не приватный серверный ключ. Но в WalletConnect Cloud желательно ограничить домены.

## 3. Проверить публикацию

Открыть:

```text
Actions → Deploy to GitHub Pages
```

После успешного запуска сайт будет доступен примерно по адресу:

```text
https://vanitoo.github.io/swap_usdt/
```

## 4. Если будет свой домен

Позже можно подключить домен, например:

```text
swap.6679.ru
```

Для этого понадобится:

1. Настроить Custom domain в GitHub Pages.
2. Добавить DNS CNAME на стороне домена.
3. После этого можно убрать `basePath` для github.io-адреса, если сайт будет жить только на своем домене.

## Безопасность

Нельзя добавлять в репозиторий:

- seed phrase;
- private key;
- API secret;
- биржевые ключи;
- `.env.local`;
- ключи от кошельков.

Текущий MVP не хранит средства и не использует серверную часть.
