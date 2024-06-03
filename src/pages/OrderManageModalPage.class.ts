import test, { Locator, Page } from "@playwright/test";
import { MainWrapper } from "./MainWrapper.class";
import { delay } from "../functions";
import { Order } from "../types";

export class OrderManageModalPage extends MainWrapper {
  constructor(page: Page) {
    super(page);
    // use such shaky selector for top modal  *Order container
    this.root_container = this.page.locator(`[style*='width: 550px']`);

    this.place_order_button = this.root_container.locator(`button`, { hasText: "Place Order" });
    this.sell_button = this.root_container.getByText(/^Sell[\n\d\.\\n]{0,}$/);
    this.buy_button = this.root_container.getByText(/^Buy[\d\.\\n]{0,}$/);
    this.close_modal_button = this.root_container.locator(`[id='ic_cross']`).locator("..");
  }

  root_container: Locator;
  place_order_button: Locator;
  sell_button: Locator;
  buy_button: Locator;
  close_modal_button: Locator;

  async switchTab(type: Order) {
    await this.root_container.isEnabled();
    await this.root_container.getByText(`${type} Order`, { exact: true }).click();
  }

  // primitive order placement by stock name and mode
  async basicOrderPlacement({ stock_name, mode }: { stock_name: string; mode: "buy" | "sell" }) {
    await this.root_container.isEnabled();

    await test.step("process order data", async () => {
      // stock_name actually reaaly hard to set because of lack of proper selectors on that form field, so skip for now-_-
      let mode_button: Locator;
      switch (mode) {
        case "buy":
          mode_button = this.buy_button;
          break;
        case "sell":
          mode_button = this.sell_button;
          break;

        default:
          break;
      }

      await mode_button.isEnabled();
      await mode_button.click();

      await this.place_order_button.click();
    });

    await test.step("check confirmation and close order modal", async () => {
      await delay(550);
      await this.root_container.getByText("Thank you!", { exact: true }).isVisible();
      await this.close_modal_button.click();
    });
  }
}
