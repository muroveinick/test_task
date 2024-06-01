import { test as _test, expect } from "@playwright/test";
import { delay } from "../src/functions";
import { MainWrapper } from "../src/pages/MainWrapper.class";
import { RegistrationPage } from "../src/pages/RegistrationPage.class";

interface Pages {
  reg_page: RegistrationPage;
}

export const test = _test.extend<Pages>({
  reg_page: async ({ page }, use) => {
    const reg_page = new RegistrationPage(page);
    await reg_page.openUrl(process.env.APP_URL);

    await reg_page.toggleNavigationMenu("expand");
    await reg_page.languageSwitch("ru");
    await use(reg_page);
  },
});

test("main", async ({ page, reg_page }) => {
  await test.step("basic init", async () => {
    const main = new MainWrapper(page);
    await main.openUrl(process.env.APP_URL);

    await main.toggleNavigationMenu("expand");
    await main.languageSwitch("ru");

  });

  await test.step("login", async () => {
    await reg_page.hitLogin();
    await reg_page.switchMode("login");
    await reg_page.login({ login: process.env.LOGIN, password: process.env.PASSWORD });

    await delay(20200);
  });

  await test.step("open new trade", async () => {});
});
