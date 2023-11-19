import React from "react";
import { User } from "@prisma/client";
import prisma from "@/libs/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import PostsFeed from "./PostsFeed";

type CustomFeedProps = {
  user: User;
};

const CustomFeed: React.FC<CustomFeedProps> = async ({ user }) => {
  const followedCommunities = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const initialPosts = await prisma.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((sub) => sub.subreddit.name),
        },
      },
    },
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

  return <PostsFeed initialPosts={initialPosts} showSubreddit user={user} />;
};

export default CustomFeed;
