import { createEvent, createStore, sample } from "effector";

type Theme = "light" | "dark";

export const $theme = createStore<Theme>("light");

export const toggleTheme = createEvent();

sample({
  clock: toggleTheme,
  source: $theme,
  fn(theme) {
    const newTheme = theme === "light" ? "dark" : "light";

    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    return newTheme;
  },
  target: $theme,
});
