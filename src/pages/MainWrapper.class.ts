import test, { Locator, Page, expect } from "@playwright/test";
import { LanguageToken } from "../types";
import { delay } from "../functions";

export class MainWrapper {
  constructor(page: Page) {
    this.page = page;
    this.burger_button = this.page.locator(`[id='ic_hamburger']`);
  }

  page: Page;
  burger_button: Locator;

  async openUrl(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.burger_button.isEnabled();
  }

  async hitLogin(): Promise<void> {
    const login_button = this.page.locator('[data-smoke-id="log-in"]').locator("button");
    await login_button.click();
  }

  async toggleNavigationMenu(position: "collapse" | "expand") {
    await this.burger_button.isEnabled();

    // pretty tricky place, where i define if nav menu expanded/collapsed based on inline style on some of container
    const current_state =
      (await this.page.locator(`div[style*="min-width: 378px"]`).count()) === 1
        ? "expand"
        : (await this.page.locator(`div[style*="min-width: 40px"]`).count()) === 1
        ? "collapse"
        : "error";

    expect(current_state, `Error while defining current_state == ${current_state}`).not.toBe("error");

    if (current_state !== position) {
      await this.burger_button.locator("..").click();
    }
  }

  async switchLanguage(lang_token: LanguageToken) {
    const lang_switch_button = this.page.locator(`[id*='ic_lang']`),
      count = await lang_switch_button.count();

    await test.step("switchLanguage", async () => {
      //   check if lang popup not opened
      if (count !== 1) {
        await this.page.keyboard.press("Escape");
        await delay(3000);
        await this.switchLanguage(lang_token);
      } else {
        // chech if selectef lang already set to correct
        const curr_language = await lang_switch_button.evaluate((el) => el.id.split("_").pop());

        if (curr_language === lang_token) {
          return;
        }

        await lang_switch_button.locator("..").click();
        const target_lang = this.page.locator(`[id*='ic_lang_${lang_token}']`),
          count = await target_lang.count();
        expect(count, `Error in lang switch, count == ${count}`).toBe(1);

        await target_lang.locator("..").click();
      }
    });
  }

  async navigateInLeftMenu(item: "Trade" | "Copy" | "Algo" | "Analyze" | "Widgets") {
    const map = {
      Trade: "ic_trader",
      Copy: "ic_copy",
      Algo: "ic_bot",
      Analyze: "ic_analyze",
      Widgets: "ic_widgets_tab",
    };

    await this.burger_button.isEnabled();
    await this.page.locator(`[id='${map[item]}']`).locator("..").click();
  }
}
