import { useUnit } from "effector-react";
import React, { Fragment } from "react";
import { Button } from "rsuite";
import { $theme, toggleTheme } from "../../store/theme";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const theme = useUnit($theme);

  const toggle = useUnit(toggleTheme);

  const buttonText = theme === "dark" ? "Light" : "Dark";
  const buttonVariant = theme === "dark" ? "primary" : "default";

  return (
    <Fragment>
      <header className="text-right pr-4 py-2">
        <Button onClick={toggle} appearance={buttonVariant}>
          {buttonText}
        </Button>
      </header>
      {children}
    </Fragment>
  );
};
