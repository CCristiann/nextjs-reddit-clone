"use client";

import { Post as PostType, Prisma, Subreddit, User, Vote } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import React, { ReactNode, useMemo, useRef } from "react";
import { Dot, Edit, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { HoverCard, HoverCardContent } from "../ui/Hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Button } from "../ui/Button";
import PostVoteClient from "./vote/PostVoteClient";
import EditorOutput from "../editor/EditorOutput";

type PartialVote = Pick<Vote, "type">;

type PostProps = {
  post: PostType & {
    author: User;
    votes: Vote[];
    comments?: [string];
    subreddit: Subreddit & { _count: Prisma.SubredditCountOutputType };
  };
  showSubreddit?: boolean;
  votesAmount: number;
  currentVote?: PartialVote;
};

const Post: React.FC<PostProps> = ({
  post,
  showSubreddit,
  votesAmount,
  currentVote,
}) => {
  const router = useRouter();
  const postRef = useRef<HTMLParagraphElement>(null);

  const createdAt = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const goToSubreddit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${window.location.origin}/r/${post.subreddit.name}`);
  };

  const goToPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(
      `${window.location.origin}/r/${post.subreddit.name}/post/${post.id}`,
    );
  };

  const goToUserProfilePage = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${window.location.origin}/user/${post.author.username}`);
  };

  return (
    <>
      {/* SMALLL */}
      <div
        className="z-0 flex flex-col rounded-md bg-zinc-50 shadow-md dark:bg-zinc-900 md:hidden"
        onClick={goToPost}
      >
        <div className="w-full overflow-hidden px-3 pb-2 pt-3">
          <div className="flex items-center">
            {showSubreddit && (
              <>
                <div className="flex cursor-default items-center gap-2">
                  <Avatar className="flex h-6 w-6 items-center cursor-pointer justify-center border-2 border-white bg-sky-600">
                    <AvatarImage src={post.subreddit.image!} />
                    <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                      r/
                    </AvatarFallback>
                  </Avatar>
                  <p
                    onClick={goToSubreddit}
                    className="text-xs font-bold text-zinc-900 hover:underline dark:text-zinc-50 cursor-pointer"
                  >
                    r/{post.subreddit.name}
                  </p>
                </div>
                
                <Dot className="text-neutral-500" size={17} />
              </>
            )}

            <p className="text-xs text-neutral-500">
              Posted by
              <span
                onClick={goToUserProfilePage}
                className="cursor-pointer hover:underline"
              >
                &nbsp;u/{post.author.username}&nbsp;
              </span>
              {createdAt}
            </p>
          </div>

          <div
            className="relative my-1.5 flex w-full flex-col items-start gap-1.5"
            ref={postRef}
          >
            <h1 className="w-11/12 break-words text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {post.title}
            </h1>

            <EditorOutput content={JSON.parse(JSON.stringify(post.content))} />

            {postRef.current?.clientHeight! > 200 && (
              <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-900"></div>
            )}
          </div>

          <div className="z-10 -ml-2 flex w-full gap-x-3 bg-zinc-50 dark:bg-zinc-900">
            <PostVoteClient
              displayOrizzontally
              postId={post.id}
              initialVoteAmount={votesAmount}
              initialVote={currentVote?.type}
            />
            <p className="flex w-fit items-center gap-1 rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10">
              <MessageSquare size={17} strokeWidth={1.5} />
              <span>{post.comments?.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* LARGE / MEDIUM */}
      <div
        className="z-0 hidden rounded-sm bg-zinc-50 shadow-md dark:bg-zinc-900 md:flex"
        onClick={goToPost}
      >
        <PostVoteClient
          postId={post.id}
          initialVoteAmount={votesAmount}
          initialVote={currentVote?.type}
        />

        <div className="w-full overflow-hidden px-2 pb-1 pt-2 cursor-pointer">
          <div className="flex items-center z-10">
            {showSubreddit && (
              <>
                <HoverCard openDelay={450}>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-default">
                      <Avatar onClick={goToSubreddit} className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600 cursor-pointer">
                        <AvatarImage src={post.subreddit.image!} />
                        <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                          r/
                        </AvatarFallback>
                      </Avatar>
                      <p
                        onClick={goToSubreddit}
                        className="text-xs font-bold text-zinc-900 hover:underline dark:text-zinc-50 cursor-pointer"
                      >
                        r/{post.subreddit.name}
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="cursor-default absolute -left-5 z-[999] flex h-fit min-w-[150px] flex-col gap-2 rounded-md border-[1px] border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-700 dark:bg-zinc-900">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-sky-600">
                        <AvatarImage src={post.subreddit.image!} />
                        <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                          r/
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                        r/{post.subreddit.name}
                      </p>
                    </div>

                    <p className="flex flex-col items-start text-xs text-neutral-500">
                      <span className="text-base text-zinc-900 dark:text-zinc-50">
                        {post.subreddit._count.subscribers}
                      </span>
                      Members
                    </p>

                    <Button className="black-style_btn" onClick={goToSubreddit}>
                      View Community
                    </Button>
                  </HoverCardContent>
                </HoverCard>

                <Dot className="text-neutral-500" size={17} />
              </>
            )}

            <p className="text-xs text-neutral-500 cursor-default">
              Posted by&nbsp;
            </p>
            <HoverCard openDelay={450}>
              <HoverCardTrigger>
                <p
                  onClick={goToUserProfilePage}
                  className="cursor-pointer text-xs text-neutral-500 hover:underline"
                >
                  u/{post.author.username}
                </p>

              </HoverCardTrigger>
              <HoverCardContent className="cursor-default absolute -left-5 z-[999] flex h-fit min-w-[150px] flex-col gap-2 rounded-md border-[1px] border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-700 dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                  <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-sky-600">
                    <AvatarImage src={post.author.imageUrl!} />
                    <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                      r/
                    </AvatarFallback>
                  </Avatar>
                  <p className="flex flex-col text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    {post.author.name}
                    <span className="font-normal text-neutral-500">
                      u/{post.author.username}
                    </span>
                  </p>
                </div>

                <Button className="black-style_btn mt-4" onClick={goToUserProfilePage}>
                  View Profile
                </Button>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div
            className="relative my-1.5 flex flex-col items-start gap-1.5"
            ref={postRef}
          >
            <h1 className="w-11/12 break-words text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {post.title}
            </h1>

            <EditorOutput content={JSON.parse(JSON.stringify(post.content))} />

            {postRef.current?.clientHeight! > 200 && (
              <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-900"></div>
            )}
          </div>

          <div className="z-10 -ml-2 w-fit cursor-pointer bg-zinc-50 dark:bg-zinc-900">
            <p className="flex w-fit items-center gap-1 rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10">
              <MessageSquare size={17} />
              <span>{post.comments?.length}</span>
              Comments
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
