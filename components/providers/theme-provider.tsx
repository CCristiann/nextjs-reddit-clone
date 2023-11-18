"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import SkeletonProvider from "./SkeletonProvider";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SkeletonProvider>{children}</SkeletonProvider>
    </NextThemesProvider>
  );
}
