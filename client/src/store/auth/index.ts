import { createDomain, sample } from "effector";
import { createGate } from "effector-react";
import { navigateFx } from "../routes";

const authDomain = createDomain("auth");

export const AuthGate = createGate();

export const $username = authDomain.createStore<string>("");
export const userNameChanged = authDomain.createEvent<string>();

export const $isAuthorized = authDomain.createStore<boolean>(false);

export const login = authDomain.createEvent();

export const saveUserNameInLocalStorageFx = authDomain.createEffect(
  (username: string) => {
    sessionStorage.setItem("mafia-user", username);
  }
);

export const removeTokensFromLocalStorageFx = authDomain.createEffect(() => {
  sessionStorage.removeItem("mafia-user");
});

export const signOut = authDomain.createEvent();

export const checkAuthStateFx = authDomain.createEffect(async () => {
  const username = sessionStorage.getItem("mafia-user");

  if (!username) {
    throw new Error("User not found");
  }

  return username;
});

export const $checkingAuthState = checkAuthStateFx.pending;

// subscribing
sample({
  clock: AuthGate.open,
  target: checkAuthStateFx,
});

sample({
  clock: userNameChanged,
  target: $username,
});

sample({
  clock: login,
  source: $username,
  fn: (clk) => {
    return !!clk;
  },
  target: $isAuthorized,
});

sample({
  clock: checkAuthStateFx.doneData,
  fn: (clk) => {
    return !!clk;
  },
  target: $isAuthorized,
});

sample({
  clock: login,
  source: $username,
  target: saveUserNameInLocalStorageFx,
});

sample({
  clock: saveUserNameInLocalStorageFx.doneData,
  fn: () => {
    return "/lobby";
  },
  target: navigateFx,
});

sample({
  clock: signOut,
  target: removeTokensFromLocalStorageFx,
});

$username
  .on(checkAuthStateFx.doneData, (_, username) => username)
  .reset(signOut);

$isAuthorized
  .on(removeTokensFromLocalStorageFx.doneData, () => false)
  .reset(signOut);
