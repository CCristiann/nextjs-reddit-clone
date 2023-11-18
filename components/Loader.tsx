"use client";

import { Spinner } from "flowbite-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type LoaderProps = {
  className?: string;
  size: "sm" | "md" | "lg" | "xl";
};
const Loader: React.FC<LoaderProps> = ({ className, size }) => {
  return (
    <Spinner
      aria-label="Loading..."
      size={size}
      className={`
        ${twMerge(className)}
        fill-sky-600 text-zinc-900/30
      `}
    />
  );
};

export default Loader;
