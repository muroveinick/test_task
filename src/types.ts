import { MainWrapper } from "./pages/MainWrapper.class";
import { RegistrationModalPage } from "./pages/RegistrationModalPage.class";
import { TradePage } from "./pages/TradePage.class";

export type LanguageToken =
  | "ru"
  | "ar"
  | "cs"
  | "de"
  | "el"
  | "en"
  | "es"
  | "fr"
  | "hu"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "ms"
  | "pl"
  | "pt"
  | "ru"
  | "sk"
  | "sl"
  | "sr"
  | "th"
  | "tr"
  | "vi"
  | "zh";

export type Order = "Market" | "Limit" | "Stop" | "Stop-limit";

export interface FixturePages {
  reg_page: RegistrationModalPage;
  main: MainWrapper;
  trade_page: TradePage;
}
