"use client";

import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/Dropdown-menu";
import { ChevronDown, Home, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { Subreddit, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { usePathname } from "next/navigation";
import NavigationStatus from "./NavigationStatus";

type NavigationMenuProps = {
  user: User | null;
};

const NavigationMenu: React.FC<NavigationMenuProps> = ({ user }) => {
  const pathName = usePathname();

  const { data: followedCommunities } = useQuery({
    queryKey: ["followed-communities"],
    queryFn: async () => {
      if (!user) return null;

      const res = await axios.get(`/api/user/${user?.id}/subreddits`);
      return res.data;
    },
  });

  const FollowedSubreddits = () => {
    if (followedCommunities) {
      return (
        <div className="max-h-[240px] overflow-auto">
          {followedCommunities.map((subreddit: Subreddit) => (
            <Link key={subreddit.id} href={`/r/${subreddit.name}`}>
              <DropdownMenuItem className="dropdown-menu-item__icon px-4">
                <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
                  <AvatarImage src={subreddit.image!} />
                  <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                    r/
                  </AvatarFallback>
                </Avatar>
                <p>r/{subreddit.name}</p>
              </DropdownMenuItem>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-fit items-center justify-between gap-4 rounded-md border border-transparent bg-transparent px-2 py-1 transition hover:border-zinc-200 dark:hover:border-neutral-700 md:w-[180px] md:gap-3">
        <div className="flex items-center gap-3">
          <NavigationStatus pathName={pathName} />
        </div>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mb-1 ml-10 w-[270px] rounded-md border border-zinc-200 bg-zinc-50 dark:border-neutral-700 dark:bg-zinc-900">
        <DropdownMenuLabel
          className={`
            dropdown-menu-label
            ${twMerge("px-4 text-xs uppercase")}
          `}
        >
          Your communities
        </DropdownMenuLabel>
        <Link href="/r/create">
          <DropdownMenuItem className="dropdown-menu-item__icon px-4">
            <Plus size={20} />
            <p>Create a Community</p>
          </DropdownMenuItem>
        </Link>

        <FollowedSubreddits />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenu;
