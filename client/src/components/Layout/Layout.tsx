import { useUnit } from "effector-react";
import React, { Fragment } from "react";
import { Button } from "rsuite";
import { $theme, toggleTheme } from "../../store/theme";
import { $isAuthorized, signOut } from "../../store/auth";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const theme = useUnit($theme);

  const toggle = useUnit(toggleTheme);
  const isAuthorized = useUnit($isAuthorized);
  const handleLogout = useUnit(signOut);

  const buttonText = theme === "dark" ? "Light" : "Dark";
  const buttonVariant = theme === "dark" ? "primary" : "default";

  return (
    <Fragment>
      <header className="text-right pr-4 py-2">
        {isAuthorized && (
          <Button onClick={handleLogout} className="mr-4">
            Logout
          </Button>
        )}

        <Button onClick={toggle} appearance={buttonVariant}>
          {buttonText}
        </Button>
      </header>
      {children}
    </Fragment>
  );
};
