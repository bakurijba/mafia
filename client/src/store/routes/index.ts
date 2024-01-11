import {
  Location,
  NavigateFunction,
  NavigateOptions,
  To,
} from "react-router-dom";
import { attach } from "effector";
import { createGate } from "effector-react";

export const NavigateFunctionGate = createGate<NavigateFunction>();
export const LocationGate = createGate<Location>();
export const SearchParamsGate = createGate<URLSearchParams>();

export const navigateFx = attach({
  source: NavigateFunctionGate.state,
  effect: (navigate, to: To, options?: NavigateOptions) =>
    navigate(to, options),
});
