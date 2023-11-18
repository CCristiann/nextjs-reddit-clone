import React from "react";

import prisma from "@/libs/prismadb";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ChooseCommunity from "@/components/ChooseCommunity";
import { currentUser } from "@/libs/auth";
import SubredditInfoSidebar from "@/components/sidebars/SubredditInfoSidebar";
import RulesSidebar from "@/components/sidebars/RulesSidebar";
import PostForm from "@/components/forms/PostForm";

type Props = {
  params: {
    slug: string;
  };
};

const SubmitPostPage = async ({ params }: Props) => {
  const user = await currentUser();

  const subreddit = await prisma.subreddit.findUnique({
    where: {
      name: params.slug,
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <div className="mx-auto h-full max-w-5xl px-4 pt-6">
        <div>
          {/* <ToFeedButton /> */}
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
            <ul className="col-span-2 mb-6 flex flex-col space-y-6">
              <div className="h-fit w-full border-b-[1px] border-zinc-50 pb-4 dark:border-neutral-700">
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Create a post in{" "}
                  <span className="text-lg text-neutral-500">
                    r/{subreddit.name}
                  </span>
                </h1>
              </div>
              <ChooseCommunity user={user} selectedSubreddit={subreddit} />
              <PostForm subredditId={subreddit.id} />
            </ul>

            {/* info sidebar */}
            <div className="flex flex-col gap-3">
              <RulesSidebar />
              <SubredditInfoSidebar subreddit={subreddit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitPostPage;
