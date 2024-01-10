import { createEffect } from "effector";
import { showErrorMessage, showSuccessMessage } from "../../main/notifications";

export const showSuccessMessageFx = createEffect((text: string) => {
  showSuccessMessage(text);
});

export const showErrorMessageFx = createEffect((text: string) => {
  showErrorMessage(text);
});
