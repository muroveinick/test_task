- [Configuration](#configuration)
- [Deployments](#Deployments)
- [Tests](#tests)

---

## Configuration

Все настройки окружения хранятся в файле [.env](.env).

В файле в настоящий момент необходимо указать:
BASE_URL - URL адрес тестируемого приложения.
LOGIN - почта тестового пользователя под которым будет выполнен вход в приложение
PASSWORD - пароль для тестового пользователя под которым будет выполнен вход в приложение

## Deployments

0. Среда разработки

   ```
        node: v20.5.0
        npm: v9.8.0
   ```

   Для подготовки тестов к запуску после клонирования репозитория необходимо выполнить следующие действия:

1. Выполнить в консоли IDE следующие команды:
   ```
        npm i
        npx playwright install 
   ```
2. Указать в файле [.env](.env) актуальные значения, например:
   ```
        BASE_URL = https://main.app.com
        LOGIN = test@mail.com
        PASSWORD = testPassword
   ```
3. Запуск:
   ```
        npm run start
   ```
   или для запуска с окном браузеров:
   ```
        npm run start_headed
   ```

## tests

Основной тест файл: tests\main_test.spec.ts

Критерием успешного прохождения теста считаем, что после нажатия на кнопку "Place Order" в списке открытых ордеров появляется 1 новая запись, атрибуты которой соответствуют созданному ордеру.

На главной странице приложения поиск элементов существенно ограничен из-за отсутствия почти всех html-тегов кроме "div" и удобных аттрибутов-якорей, присутствали практически только автоматически сгенериованные фреймворком "class"-ы, -- поэтому некоторые элементы приходилось искать по их стилям, как на приведенном фрагменте:

```js
this.root_container = this.page.locator(`[style*='width: 550px']`);
```

По этой же причине в коде присутствуют немного статичных ожиданий. Так, при загрузке страницы было бы логично отслеживать исчезновение спинеров как критерия полностью загруженной страницы. Однако их поиск не удалось бы сделать без сложных evaluate-ов c поиском отрендеренных стилей нужных анимаций, поэтому для простоты в таких местах стоят статичные ожидания.

```js
await delay(500);
```

---
