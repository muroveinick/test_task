import test, { Locator, Page } from "@playwright/test";
import { MainWrapper } from "./MainWrapper.class";
import { delay } from "../functions";

export class TradePage extends MainWrapper {
  constructor(page: Page) {
    super(page);
    this.new_order_button = this.page.locator(`[id="ic_new_order"]`).locator("..");
    this.cancel_all_button = this.page.getByText(`Cancel All`);
    this.orders_table_container = this.page.locator(`div[style*="min-height: 170px;"]`);
    this.rows = this.orders_table_container.locator(`div[cache-key*="full-undefined-"]`);
  }

  new_order_button: Locator;
  cancel_all_button: Locator;
  orders_table_container: Locator;
  rows: Locator;

  async switchOrdersTableTab(tab: "Positions" | "Orders" | "History" | "Price Alerts" | "Transactions") {
    await this.orders_table_container.isEnabled();
    await this.orders_table_container.getByText(tab, { exact: true }).click();
  }

  /**
   *
   * @returns array of order rows, row: {[header_name]: row cell value} or string[] (splited row innerText)
   */
  async getOrders(): Promise<any[]> {
    const res = [],
      table_header_items = [];

    await this.orders_table_container.isEnabled();

    // collecting header cells
    const header = this.orders_table_container.locator(`div[draggable="true"]`);
    (await header.all()).map((locator) => locator.innerText());

    for (const locator of await header.all()) {
      const text = await locator.innerText();
      if (text.length) {
        table_header_items.push(text);
      }
    }

    const rows = await this.rows.all();
    // this.page.screenshot({ path: "screenshot.png" });

    await delay(3000);

    for await (const row of rows) {
      let texts = await row.locator("div > div[tabindex]").first().innerText();
      texts = texts.split(/[\n]/) as any;
      res.push(texts);
    }

    return res.map((row: string[]) => {
      if (row.length === table_header_items.length) {
        return row.reduce((sum, curr, index) => {
          sum[table_header_items[index]] = curr;
          return sum;
        }, {});
      } else {
        return row;
      }
    });
  }

  async removeAllOrders() {
    await this.orders_table_container.isEnabled();
    await this.cancel_all_button.click();

    await test.step("remove all orders", async () => {
      const confirm_modal = this.page.getByText("Cancel All Orders"),
        is_modal_up = await confirm_modal.isVisible({ timeout: 3000 });

      await delay(550);

      if (is_modal_up) {
        const yes_button = this.page.locator(`button[type='button']`, { hasText: "Yes" });
        await yes_button.isEnabled({ timeout: 2000 });
        await yes_button.click();
      }
    });
  }
}
