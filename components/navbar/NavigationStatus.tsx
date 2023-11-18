"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Home, Lock, Plus, Settings, User2 } from "lucide-react";

type NavigationStatusProps = {
  pathName: string;
};

const NavigationStatus: React.FC<NavigationStatusProps> = ({ pathName }) => {
  if (pathName.split("/")[1] === "user") {
    return (
      <>
        <User2 />
        <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
          u/{pathName.split("/")[2]}
        </p>
      </>
    );
  }
  if (pathName.split("/")[3] === "submit") {
    return (
      <>
        <Plus />
        <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
          Create Post
        </p>
      </>
    );
  }

  if (pathName.startsWith("/settings")) {
    return (
      <>
        <Settings size={18} />
        <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
          User Settings
        </p>
      </>
    );
  }

  switch (pathName) {
    case "/":
      return (
        <>
          <Home size={18} />
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
            Home
          </p>
        </>
      );

    case "/sign-in":
      return (
        <>
          <Lock size={18} />
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
            Sign in
          </p>
        </>
      );

    case "/sign-up":
      return (
        <>
          <Lock size={18} />
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
            Sign up
          </p>
        </>
      );

    case "/r/create":
      return (
        <>
          <Plus size={18} />
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
            Create Community
          </p>
        </>
      );

    case "/submit":
      return (
        <>
          <Plus />
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">
            Create Post
          </p>
        </>
      );

    default:
      const pathNameArray = pathName.replace("/", "").split("/");

      return (
        <>
          <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
            <AvatarImage src={""} />
            <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
              r/
            </AvatarFallback>
          </Avatar>
          <p className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block">{`${pathNameArray[0]}/${pathNameArray[1]}`}</p>
        </>
      );
  }
};

export default NavigationStatus;
