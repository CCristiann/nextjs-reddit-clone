import React from "react";

import { currentUser } from "@/libs/auth";
import { notFound } from "next/navigation";
import { redis } from "@/libs/redis";
import { CachedPost } from "@/types/redis";
import { Post, Subreddit, User, Vote, VoteType } from "@prisma/client";
import prisma from "@/libs/prismadb";

import PostVoteServer from "@/components/posts/vote/PostVoteServer";
import ExtendedPost from "@/components/posts/ExtendedPost";
import SubredditInfoSidebar from "@/components/sidebars/SubredditInfoSidebar";
import PostPageHeader from "@/components/posts/PostPageHeader";
import CommentsFeed from "@/components/comments/CommentsFeed";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

type PostPageProps = {
  params: {
    postId: string;
    slug: string;
  };
};

const PostPage = async ({ params }: PostPageProps) => {
  const user = await currentUser();
  let currentVote: VoteType | undefined | null,
    votesAmount: number = 0;

  const cachedPost = (await redis.hgetall(
    `post: ${params.postId}`,
  )) as CachedPost;

  let post:
    | (Post & { votes: Vote[]; author: User; subreddit: Subreddit })
    | null = null;

  if (!cachedPost && !params.postId.startsWith("null")) {
    post = await prisma.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        comments: true,
        votes: true,
        author: true,
        subreddit: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  if (post) {
    votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    currentVote = post.votes.find((vote) => vote.userId === user?.id)?.type;
  }

  const initialComments = await prisma.comment.findMany({
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    where: {
      postId: post?.id ?? cachedPost.id,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const membersCount = await prisma.subscription.count({
    where: {
      subreddit: {
        name: post?.subreddit.name ?? cachedPost.subreddit.name,
      },
    },
  });

  return (
    <>
      <PostPageHeader subreddit={cachedPost?.subreddit || post?.subreddit} />
      <div className="page-paddings mx-auto h-full max-w-5xl pt-2">
        <div>
          {/* <ToFeedButton /> */}
          <div className="grid grid-cols-1 gap-y-4 py-2 md:grid-cols-3 md:gap-x-4">
            <ul className="col-span-2 mb-6 flex flex-col space-y-6">
              <div className="z-0 flex flex-col space-y-4 rounded-md bg-zinc-50 shadow-md dark:bg-zinc-900">
                <div className="z-0 flex">
                  <PostVoteServer
                    initialVote={currentVote}
                    initialVotesAmount={votesAmount}
                    postId={post?.id ?? cachedPost.id}
                    getData={async () => {
                      return await prisma.post.findUnique({
                        where: {
                          id: params.postId,
                        },
                        include: {
                          votes: true,
                        },
                      });
                    }}
                    bgTransparent
                  />
                  <ExtendedPost
                    sessionUser={user}
                    post={post}
                    cachedPost={cachedPost}
                    membersCount={membersCount}
                  />
                </div>
                <CommentsFeed
                  initialComments={initialComments}
                  postId={post?.id ?? cachedPost.id}
                  user={user!}
                />
              </div>
            </ul>

            {post?.subreddit || cachedPost.subreddit ? (
              <SubredditInfoSidebar
                subreddit={post?.subreddit ?? cachedPost.subreddit}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
