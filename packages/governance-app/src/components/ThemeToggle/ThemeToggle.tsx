import React, { useEffect } from "react";
import LigthThemeIcon from "@material-ui/icons/Brightness5";
import DarkThemeIcon from "@material-ui/icons/Brightness4";
import { Switch } from "@material-ui/core";

import { useLayoutContext } from "@governance-app/contexts";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useLayoutContext();

  return (
    <Switch
      checked={theme}
      color="primary"
      onChange={toggleTheme}
      checkedIcon={<LigthThemeIcon />}
      icon={<DarkThemeIcon />}
    />
  );
};

export default ThemeToggle;
