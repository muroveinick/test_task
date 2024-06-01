import { MainWrapper } from "./MainWrapper.class";
import { test } from "../../tests/main_test.spec";

export class RegistrationPage extends MainWrapper {
  constructor(page) {
    super(page);
  }

  async switchMode(mode: "login" | "registration") {
    await test.step("switchMode", async () => {

      // нет возможности опираться на нормальные селекторы, смотрим на текст внутри
      const selector = mode === "login" ? "Войти" : "Регистрация";

      const div = this.page.locator(`div`, { hasText: selector }).last();
      await div.last().click();

    });
  }

  async login({ login, password }) {
    await test.step("fill login form", async () => {
      await this.page.locator(`input[placeholder*='Введите вашу']`).fill(login);
      await this.page.locator(`input[placeholder*='Введите пароль']`).fill(password);
      await this.page.locator(`button[type='submit']`).click();
    });
  }

  async register({ login, password }) {
    /**
     *
     */
  }
}
