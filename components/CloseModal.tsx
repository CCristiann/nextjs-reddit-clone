"use client";

import React from "react";
import Icons from "./Icons";
import { useRouter } from "next/navigation";
import { buttonVariants } from "./ui/Button";

import { cn } from "@/libs/utils";

const CloseModal = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "cursor-pointer rounded-md p-1 hover:bg-neutral-500/5",
      )}
    >
      <Icons.X className="h-6 w-6 text-neutral-500" />
    </div>
  );
};

export default CloseModal;
