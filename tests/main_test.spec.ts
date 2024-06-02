import { test as _test, expect } from "@playwright/test";
import { delay } from "../src/functions";
import { MainWrapper } from "../src/pages/MainWrapper.class";
import { RegistrationModalPage } from "../src/pages/RegistrationModalPage.class";
import { OrderManageModalPage } from "../src/pages/OrderManageModalPage.class";
import { TradePage } from "../src/pages/TradePage.class";

interface Pages {
  reg_page: RegistrationModalPage;
  main: MainWrapper;
}

export const test = _test.extend<Pages>({
  // reg_page: async ({ page }, use) => {
  //   const reg_page = new RegistrationPage(page);
  //   await reg_page.openUrl(process.env.APP_URL);

  //   await reg_page.toggleNavigationMenu("expand");
  //   await reg_page.switchLanguage("ru");
  //   await use(reg_page);
  // },

  main: async ({ page }, use) => {
    const main_page = new MainWrapper(page);
    await main_page.openUrl(process.env.APP_URL);

    await main_page.toggleNavigationMenu("expand");
    await main_page.switchLanguage("en");
    await use(main_page);
  },
});

test("main", async ({ page, main }) => {
  await test.step("login", async () => {
    await main.hitLogin();

    const reg_page = new RegistrationModalPage(page);

    await reg_page.switchMode("login");
    await reg_page.login({ login: process.env.LOGIN, password: process.env.PASSWORD });
  });

  await test.step("open new trade", async () => {
    // return;
    await main.navigateInLeftMenu("Trade");
    const trade_page = new TradePage(page);

    await trade_page.removeAllOrders();
    // return;

    await trade_page.new_order_button.click();

    const order_modal = new OrderManageModalPage(page);
    await order_modal.switchTab("Limit");
    await order_modal.basicOrderPlacement({ stock_name: null, mode: "sell" });
  });

  await test.step("check orders table", async () => {
    // await delay(20200);
    const trade_page = new TradePage(page);
    const rows = await trade_page.getOrders();
    expect(rows.length).toEqual(1);
    console.log(rows.length);
  });
});
