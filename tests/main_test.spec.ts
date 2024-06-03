import { test as _test, expect } from "@playwright/test";
import { MainWrapper } from "../src/pages/MainWrapper.class";
import { RegistrationModalPage } from "../src/pages/RegistrationModalPage.class";
import { OrderManageModalPage } from "../src/pages/OrderManageModalPage.class";
import { TradePage } from "../src/pages/TradePage.class";
import { FixturePages } from "../src/types";
import { compareObjects } from "../src/functions";

export const test = _test.extend<FixturePages>({
  main: async ({ page }, use) => {
    const main_page = new MainWrapper(page);
    await main_page.openUrl(process.env.APP_URL);

    await main_page.toggleNavigationMenu("expand");
    await main_page.switchLanguage("en");
    await use(main_page);
  },

  trade_page: async ({ page }, use) => {
    const trade_page = new TradePage(page);
    await use(trade_page);
  },
});

test("main", async ({ page, main, trade_page }) => {
  await test.step("login", async () => {
    await main.hitLogin();

    const reg_page = new RegistrationModalPage(page);
    await reg_page.switchMode("login");
    await reg_page.login({ login: process.env.LOGIN, password: process.env.PASSWORD });
  });

  await test.step("remove existing order just in case from both tables", async () => {
    await main.navigateInLeftMenu("Trade");

    await trade_page.clearAllOrders();
  });

  await test.step("open new trade", async () => {
    await trade_page.new_order_button.click();

    const order_modal = new OrderManageModalPage(page);
    await order_modal.switchTab("Market");
    await order_modal.basicOrderPlacement({ stock_name: null, mode: "buy" });
  });

  await test.step("check orders table", async () => {
    await trade_page.switchOrdersTableTab("Positions");
    const rows = await trade_page.getOrders(),
      compare = compareObjects(rows[0], { "Order Type": "Limit", Direction: "Buy" });
    expect(rows.length).toEqual(1);
    expect(compare).toBeTruthy();
    console.log("Success!");
  });
});

test.afterEach(async ({ trade_page }) => {
  await trade_page.clearAllOrders();
});
