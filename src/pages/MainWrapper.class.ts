import { Page, expect } from "@playwright/test";
import { LanguageToken } from "../types";
import { delay } from "../functions";

export class MainWrapper {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async openUrl(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.locator(`[id*='ic_hamburger']`).isEnabled();
  }

  async hitLogin(): Promise<void> {
    const login_button = this.page.locator('[data-smoke-id="log-in"]').locator("button");
    await login_button.click();
  }

  async toggleNavigationMenu(position: "collapse" | "expand") {
    const burger = this.page.locator(`[id='ic_hamburger']`);
    await burger.isEnabled();

    // pretty tricky place, where we define if nav menu expanded/collapsed base on inline style on some of container
    const current_state =
      (await this.page.locator(`div[style*="min-width: 378px"]`).count()) === 1
        ? "expand"
        : (await this.page.locator(`div[style*="min-width: 40px"]`).count()) === 1
        ? "collapse"
        : "error";

    console.log(current_state, position);

    expect(current_state, `Ошибка переключения нав меню, current_state == ${current_state}`).not.toBe("error");

    if (current_state !== position) {
      await burger.locator("..").click();
    }
  }

  async languageSwitch(lang_token: LanguageToken) {
    const lang_switch_button = this.page.locator(`[id*='ic_lang']`),
      count = await lang_switch_button.count();

    //   check if lang popup not opened
    if (count !== 1) {
      await this.page.keyboard.press("Escape");
      await delay(3000);
      this.languageSwitch(lang_token);
    } else {
      // chech if selectef lang already set to correct
      const curr_language = await lang_switch_button.evaluate((el) => el.id.split("_").pop());

      if (curr_language === lang_token) {
        return;
      }

      await lang_switch_button.locator("..").click();
      const target_lang = this.page.locator(`[id*='ic_lang_${lang_token}']`),
        count = await target_lang.count();
      expect(count, `Ошибка при переключении языка, count == ${count}`).toBe(1);

      await target_lang.locator("..").click();
    //   await lang_switch_button.isEnabled();
    }
  }
}
