"use client";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { ChevronDown, CircleDashed, PlusCircle, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Subreddit, User } from "@prisma/client";
import axios from "axios";
import { useQuery } from "react-query";
import { Button } from "./ui/Button";
import { DropdownMenuItemIndicator } from "@radix-ui/react-dropdown-menu";

type ChooseCommunityProps = {
  selectedSubreddit?: Subreddit;
  user?: User | null;
};

const ChooseCommunity: React.FC<ChooseCommunityProps> = ({
  user,
  selectedSubreddit,
}) => {
  const { data: followedCommunities } = useQuery({
    queryKey: ["followed-communities"],
    queryFn: async () => {
      const res = await axios.get(`/api/user/${user?.id}/subreddits`);
      return res.data;
    },
  });

  const FollowedSubreddits = () => {
    if (followedCommunities) {
      return (
        <div className="max-h-[240px] overflow-auto">
          {followedCommunities.map((subreddit: Subreddit) => (
            <Link key={subreddit.id} href={`/r/${subreddit.name}/submit`}>
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
      <DropdownMenuTrigger className="flex w-fit items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 shadow-sm dark:border-neutral-700 dark:bg-zinc-900">
        <div className="flex flex-row-reverse items-center gap-3">
          <input
            className="peer w-[230px] border-0 bg-transparent p-0 text-sm placeholder:font-medium placeholder:text-zinc-900 focus:border-0 focus:outline-0 focus:ring-0 placeholder:dark:text-zinc-50"
            type="text"
            placeholder={`${
              selectedSubreddit
                ? `r/${selectedSubreddit.name}`
                : "Choose a community"
            }`}
          />

          {selectedSubreddit ? (
            <>
              <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
                <AvatarImage src={""} />
                <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                  r/
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Search
                size={18}
                className="hidden text-zinc-900 peer-focus:block dark:text-neutral-500"
              />
              <CircleDashed
                size={18}
                className="text-zinc-900 peer-focus:hidden dark:text-neutral-500"
              />
            </>
          )}
        </div>

        <ChevronDown
          size={18}
          className="text-zinc-900 dark:text-neutral-500"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mb-1 ml-10 w-[270px] rounded-sm border border-zinc-200 bg-zinc-50 dark:border-neutral-700 dark:bg-zinc-900">
        <DropdownMenuLabel
          className={`
            dropdown-menu-label
            ${twMerge(
              "flex w-full items-center justify-between px-4 text-xs uppercase",
            )}
          `}
        >
          <p>Your communities</p>
          <Link href="/r/create">
            <Button variant={"ghost"} className="rounded-full text-xs">
              Create New
            </Button>
          </Link>
        </DropdownMenuLabel>

        <FollowedSubreddits />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChooseCommunity;
