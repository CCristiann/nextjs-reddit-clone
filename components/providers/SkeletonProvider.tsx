"use client";

import { useTheme } from "next-themes";
import React, { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

type SkeletonProviderProps = {
  children: ReactNode;
};

const SkeletonProvider = ({ children }: SkeletonProviderProps) => {
  const { theme } = useTheme();

  return (
    <SkeletonTheme
      baseColor={`${theme === "dark" ? "#202020" : "#e5e5e5"}`}
      highlightColor={`${theme === "dark" ? "#262626" : "#f5f5f5"}`}
    >
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonProvider;
