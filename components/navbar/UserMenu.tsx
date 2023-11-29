"use client";

import React from "react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

import {
  ChevronDown,
  Eye,
  LogOut,
  Moon,
  Plus,
  Settings,
  User2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "../ui/Button";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Switch } from "../ui/Switch";
import { User } from "@prisma/client";

import toast from "react-hot-toast";
import { getInitials } from "@/libs/utils";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <SignedIn>
        {/* Mount the UserButton component */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="rounded-md border-transparent transition md:border md:px-2 md:py-1 md:hover:border-zinc-200 md:dark:hover:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="relative flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-sm">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="rounded-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="hidden text-sm text-zinc-900 dark:text-zinc-50 lg:block">
                  {user?.username}
                </p>
              </div>

              <ChevronDown
                className="ml-4 hidden text-neutral-600 md:block lg:ml-12"
                size={20}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            collisionPadding={10}
            className="bg-zinc-50 dark:bg-zinc-900"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href={`/user/${user?.username}`}>
                <DropdownMenuItem>
                  <User2 className="mr-2 h-4 w-4" />
                  <p>Profile</p>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <p>Manage Account</p>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>View Options</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <div className="relative flex cursor-default select-none items-center gap-3 rounded-sm px-2 py-1 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <div className="flex items-center">
                  <Moon className="mr-2 h-4 w-4" />
                  <p>Dark mode</p>
                </div>
                <Switch
                  checked={theme === "light" ? false : true}
                  onCheckedChange={() => {
                    if (theme === "light") setTheme("dark");
                    if (theme === "dark") setTheme("light");
                  }}
                />
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/r/create">
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <p>Create a Community</p>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <p>Log Out</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <Link
          href="/sign-in"
          className={`${buttonVariants({
            variant: "black",
          })} w-[70px] rounded-sm px-1 py-1 font-semibold md:w-[unset]`}
        >
          Sign in
        </Link>
      </SignedOut>
    </>
  );
};

export default UserMenu;
