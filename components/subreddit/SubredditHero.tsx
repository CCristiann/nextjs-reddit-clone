"use client";

import React from "react";

import Image from "next/image";
import { Avatar } from "../ui/Avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import JoinLeaveToggle from "./JoinLeaveToggle";
import { usePathname } from "next/navigation";

type SubredditHeroProps = {
  subreddit: Record<string, any>;
  isSubscribed: boolean;
};
const SubredditHero: React.FC<SubredditHeroProps> = ({
  subreddit,
  isSubscribed,
}) => {
  const pathName = usePathname();
  const pathNameArr = pathName.split("/");

  return (
    <div
      className={`
      ${pathNameArr.length <= 3 ? "flex flex-col" : "hidden"}
    `}
    >
      <div className="relative z-10 h-16 w-full md:h-20">
        {subreddit.coverImage ? (
          <Image src={subreddit.coverImage} fill alt="subreddit image" />
        ) : (
          <div className="h-full w-full bg-sky-500"></div>
        )}
      </div>
      <div className="h-16 w-full bg-zinc-50 dark:bg-zinc-900 md:h-20">
        <div className="relative mx-auto flex h-full w-full max-w-5xl items-center gap-4 px-4">
          <Avatar className="z-20 -mt-12 flex h-14 w-14 items-center justify-center border-2 border-white bg-sky-600 md:-mt-10 md:h-20 md:w-20 md:border-4">
            <AvatarImage className="h-full w-full" src={subreddit.image} />
            <AvatarFallback className="text-xl font-bold text-zinc-50 md:text-3xl">
              r/
            </AvatarFallback>
          </Avatar>

          <div className="flex h-fit gap-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
                {subreddit.name}
              </h3>
              <p className="text-sm font-semibold text-neutral-500 md:text-base">
                r/{subreddit.name}
              </p>
            </div>

            <JoinLeaveToggle
              subreddit={subreddit}
              isSubscribed={isSubscribed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubredditHero;
