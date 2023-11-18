import React from "react";

import Link from "next/link";
import Icons from "../Icons";
import UserMenu from "@/components/navbar/UserMenu";

import NavigationMenu from "./NavigationMenu";
import { Plus } from "lucide-react";

import { currentUser } from "@/libs/auth";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-fit w-screen border-b-[1px] border-zinc-300 bg-zinc-100 px-2 py-2 dark:border-neutral-700 dark:bg-zinc-900 md:px-4 md:py-1">
      <div className="flex h-fit w-full items-center justify-between gap-4 px-1.5 md:p-0">
        <div className="flex items-center md:w-1/3 md:space-x-3">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8" />
            <p className="hidden text-base font-semibold text-zinc-700 dark:text-zinc-50 md:block">
              Reddit
            </p>
          </Link>
          <div className="hidden lg:block">
            <NavigationMenu user={user!} />
          </div>
        </div>
        {/* search bar */}
        <SearchBar />

        <div className="flex w-fit items-center justify-end md:w-1/3 md:space-x-3">
          <Link
            href="/submit"
            className="hidden h-8 w-8 rounded-sm p-1 transition-colors hover:bg-zinc-200 dark:hover:bg-neutral-800 md:block"
          >
            <Plus />
          </Link>
          <UserMenu user={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
