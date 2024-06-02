import test, { Locator } from "@playwright/test";
import { MainWrapper } from "./MainWrapper.class";

export class RegistrationModalPage extends MainWrapper {
  constructor(page) {
    super(page);
    this.root_container = this.page.locator(`img[alt="Spotware cTrader"]`).locator("..").locator("..");
  }

  root_container: Locator;

  async switchMode(mode: "login" | "registration") {
    await test.step("switchMode", async () => {
      const selector = mode === "login" ? "Log In" : "Sign Up";

      await this.root_container.isEnabled();
      const div = this.root_container.getByText(selector, { exact: true });

      await div.click();
    });
  }

  async login({ login, password }) {
    await test.step("fill login form", async () => {
      await this.root_container.locator(`input[placeholder*='Enter your email']`).fill(login);
      await this.root_container.locator(`input[placeholder*='Enter your password']`).fill(password);
      await this.root_container.locator(`button[type='submit']`, { hasText: "Log In" }).click();
    });
  }

  async signup({ login, password }) {
    /**
     *
     */
  }
}
