import { themeManager } from "./modules/themeManager.js";

themeManager.init();

const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    themeManager.toggleTheme();
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    themeManager.init();
  }
});
