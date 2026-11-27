"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps, FC } from "react";

const ThemeProvider: FC<ComponentProps<typeof NextThemesProvider>> = ({ children, ...props }) => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
