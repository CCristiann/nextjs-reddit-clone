"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useIntersection } from "@mantine/hooks";

import axios from "axios";
import { User } from "@prisma/client";

import Post from "./Post";
import LoadingPost from "./LoadingPost";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

type PostsFeedProps = {
  initialPosts: Record<string, any>;
  subredditName?: string;
  showSubreddit?: boolean;
  user?: User | null;
  onlyUserPosts?: boolean;
};

const PostsFeed: React.FC<PostsFeedProps> = ({
  initialPosts,
  subredditName,
  showSubreddit,
  user,
  onlyUserPosts,
}) => {
  const lastPostRef = useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["infinite-query"],
      async ({ pageParam = 1 }) => {
        let query;

        query =
          `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
          (!!subredditName ? `&subredditName=${subredditName}` : "") +
          (!!onlyUserPosts && user ? `&userId=${user.id}` : "");

        const { data } = await axios.get(query);
        return data;
      },

      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
      },
    );

  //Fetch more posts after last post fetched is intersecting the user screen
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  //Display loading post skeleton is posts are fetching
  if (isFetching && !isFetchingNextPage)
    return (
      <div className="flex flex-col gap-2 md:gap-3">
        <LoadingPost />
        <LoadingPost />
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-2 pb-32 md:gap-3">
        {posts.length === 0 && (
          <p className="mb-4 flex w-full items-center justify-center text-lg font-bold text-zinc-900 dark:text-zinc-50">
            There are no posts yet!
          </p>
        )}
        <>
          {posts.map((post: any, index: number) => {
            const votesAmount = post.votes.reduce((acc: any, vote: any) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const currentVote = post.votes.find(
              (vote: any) => vote.userId === user?.id,
            );

            if (index === posts.length - 1) {
              return (
                <li className="list-none" key={post.id} ref={ref}>
                  <Post
                    post={post}
                    showSubreddit={showSubreddit}
                    votesAmount={votesAmount}
                    currentVote={currentVote}
                  />
                </li>
              );
            } else {
              return (
                <Post
                  key={post.id}
                  post={post}
                  showSubreddit={showSubreddit}
                  votesAmount={votesAmount}
                  currentVote={currentVote}
                />
              );
            }
          })}
        </>
        {isFetchingNextPage && (
          <>
            <LoadingPost />
            <LoadingPost />
          </>
        )}
      </div>
    </>
  );
};

export default PostsFeed;
