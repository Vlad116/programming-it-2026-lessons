import { storage } from "./storage.js";

const THEME_KEY = "theme";

export const themeManager = {
  getCurrentTheme() {
    const savedTheme = storage.get(THEME_KEY);

    return savedTheme?.mode ?? "light"; // по умолчанию светлая
  },

  setTheme(mode) {
    storage.set(THEME_KEY, { mode });
    this.applyTheme(mode);
  },

  applyTheme(mode) {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggleTheme() {
    const current = this.getCurrentTheme();
    const newTheme = current === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  },

  init() {
    const savedTheme = this.getCurrentTheme();
    this.applyTheme(savedTheme);
  },
};
