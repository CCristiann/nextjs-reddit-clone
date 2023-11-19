import React from "react";
import { Subreddit } from "@prisma/client";

import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { CakeSlice } from "lucide-react";

import prisma from "@/libs/prismadb";
import format from "date-fns/format";
import { twMerge } from "tailwind-merge";

type SubredditInfoSidebarProps = {
  subreddit: Subreddit;
};

const SubredditInfoSidebar: React.FC<SubredditInfoSidebarProps> = async ({
  subreddit,
}) => {
  if (!subreddit) return null;

  const memberCount = await prisma.subscription.count({
    where: {
      subreddit: {
        name: subreddit.name,
      },
    },
  });

  const createdAt = new Date(subreddit.createdAt);

  return (
    <div className="sticky top-[4.5rem] order-first hidden h-fit overflow-hidden rounded-sm border border-gray-200 dark:border-neutral-700 md:order-last md:block">
      <div className="bg-sky-600 p-3 text-zinc-50 dark:border-b-[1px] dark:border-neutral-700 dark:bg-zinc-900">
        <p className="text-base font-bold">About community</p>
      </div>
      <div className="divide-y divide-neutral-200 bg-zinc-50 px-3 dark:divide-neutral-700 dark:bg-zinc-900">
        <div className="py-4">
          <p className="flex items-center text-sm text-zinc-900 dark:text-zinc-50">
            <CakeSlice size={20} className="mr-2" />
            Created&nbsp;
            <time dateTime={subreddit.createdAt.toString()}>
              {format(createdAt, "MMMM d, yyyy")}
            </time>
          </p>
        </div>

        <div className="py-4">
          <p className="flex flex-col text-sm text-neutral-500">
            <span className="text-base text-zinc-900 dark:text-zinc-50">
              {memberCount}
            </span>
            Members
          </p>
        </div>

        <div className="w-full py-4">
          <Link
            className={`
              ${buttonVariants({
                variant: "blue",
              })}
              ${twMerge("w-full rounded-full")}
            `}
            href={`/r/${subreddit.name}/submit`}
          >
            Create Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubredditInfoSidebar;
