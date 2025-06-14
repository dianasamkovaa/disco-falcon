"use client";

import * as React from "react";
import { createContext, useLayoutEffect, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import type { Theme } from "@mui/system";

interface ThemeContextType {
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  toggleThemeMode: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

type ModeType = "light" | "dark";

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const defaultMode = "dark";
  const [mode, setMode] = useState<ModeType>(defaultMode);

  const handleStorageChange = (type: ModeType) => {
    localStorage.setItem("mode", type);
  };
  const initializeModeFromStorage = () => {
    const newMode = localStorage.getItem("mode") || defaultMode;
    setMode(newMode as ModeType);
  };

  useLayoutEffect(() => {
    initializeModeFromStorage();
  }, []);

  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        handleStorageChange(mode === "light" ? "dark" : "light");
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme: Theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
