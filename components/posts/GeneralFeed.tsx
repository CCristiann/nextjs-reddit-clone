import React from "react";
import PostsFeed from "./PostsFeed";

import prisma from "@/libs/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

const GeneralFeed = async () => {
  const initialPosts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      subreddit: true,
      votes: true,
      comments: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <PostsFeed initialPosts={initialPosts} showSubreddit />;
};

export default GeneralFeed;
