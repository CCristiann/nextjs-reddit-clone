"use client";
import React from "react";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const HomeSidebarBtns = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col px-3">
      <Button
        variant={"blue"}
        className="mb-3 rounded-full"
        onClick={() => router.push("/submit")}
      >
        Create Post
      </Button>
      <Button
        variant={"blue_outline"}
        className="mb-3 rounded-full"
        onClick={() => router.push("/r/create")}
      >
        Create Community
      </Button>
    </div>
  );
};

export default HomeSidebarBtns;
