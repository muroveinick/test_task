import { test, Locator, Page } from "@playwright/test";
import { MainWrapper } from "./MainWrapper.class";
import { delay } from "../functions";

export class TradePage extends MainWrapper {
  constructor(page: Page) {
    super(page);
    this.new_order_button = this.page.locator(`[id="ic_new_order"]`).locator("..");
    this.orders_table_container = this.page.locator(`div[style*="min-height: 170px;"]`);
    this.cancel_all_button = this.orders_table_container.getByText(/Cancel|Close/);
    this.rows = this.orders_table_container.locator(`div[cache-key*="full-undefined-"]`);
  }

  new_order_button: Locator;
  cancel_all_button: Locator;
  orders_table_container: Locator;
  rows: Locator;

  async switchOrdersTableTab(tab_name: "Positions" | "Orders" | "History" | "Price Alerts" | "Transactions") {
    await this.orders_table_container.isEnabled();
    const tab_ = this.orders_table_container.getByText(tab_name);
    await tab_.click({ timeout: 3000 });
  }

  /**
   *
   * @returns array of order rows, row: {[header_name]: row cell value} or string[] (splited row innerText)
   */
  async getOrders(): Promise<any[]> {
    const res: any[] = [],
      table_header_items: string[] = [];

    await this.orders_table_container.isEnabled();

    await test.step("getOrders", async () => {
      // collecting header cells scraping from page
      const header = this.orders_table_container.locator(`div[draggable="true"]`);
      (await header.all()).map((locator) => locator.innerText());

      for (const locator of await header.all()) {
        const text = await locator.innerText();
        // filter technical columns with buttons == with no inner text
        if (text.length) {
          table_header_items.push(text);
        }
      }

      const rows = await this.rows.all();
      // tricky delay, there is no clear indicators of moment when all data and graphs are loaded so i used hardcode delay
      await delay(2000);

      for await (const row of rows) {
        let texts = await row.locator("div > div[tabindex]").first().innerText();
        texts = texts.split(/[\n]/) as any;
        res.push(texts);
      }
    });

    // create <[header_cell_name]: tabel_body_value>[] from string[][] if possible (equality of arr.length is key)
    return res.map((row: string[]) => {
      if (row.length === table_header_items.length) {
        return row.reduce((sum, curr, index) => {
          sum[table_header_items[index]] = curr;
          return sum;
        }, {} as any);
      } else {
        // or return just plain string[]
        return row;
      }
    });
  }

  async removeTabOrders() {
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
      } else {
        console.warn("failed with remove all orders");
      }
    });
  }

  async clearAllOrders() {
    await this.switchOrdersTableTab("Orders");
    await this.removeTabOrders();

    await this.switchOrdersTableTab("Positions");
    await this.removeTabOrders();
  }
}
