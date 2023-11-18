import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";
import Loader from "../Loader";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        black:
          "text-zinc-50 bg-zinc-900 hover:bg-zinc-800 font-bold py-1.5 px-3",
        white: "font-bold text-zinc-900 bg-zinc-50 py-1.5 px-3",
        blue: "font-bold text-zinc-50 dark:text-zinc-900 bg-sky-600 dark:bg-zinc-50 hover:bg-sky-600/90 dark:hover:bg-zinc-200 py-1.5 px-3",
        blue_outline:
          "font-bold text-sky-600 dark:text-zinc-50 border border-sky-600 dark:border-zinc-50 bg-trasparent hover:bg-sky-600/10 dark:hover:bg-zinc-50/5 py-1.5 px-3",
        ghost:
          "text-zinc-900 dark:text-zinc-50 px-2 py-1 hover:bg-neutral-700/10 hover:dark:bg-neutral-700/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading,
      children,
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader size="sm" className="h-4 w-4 animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
