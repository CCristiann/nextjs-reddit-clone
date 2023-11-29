"use client";

import { Post, Subreddit, User, Vote } from "@prisma/client";
import React from "react";

import { formatDistanceToNow } from "date-fns";
import { CachedPost } from "@/types/redis";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/Hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import EditorOutput from "../editor/EditorOutput";
import CommentForm from "../forms/CommentForm";
import { Dot, MessageSquare, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/Alert-dialog";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";

type PartialVote = Pick<Vote, "type">;

type ExtendedPostProps = {
  sessionUser?: User | null;
  post:
    | (Post & {
        author: User;
        votes: Vote[];
        comments?: [string];
        subreddit: Subreddit;
      })
    | null;
  cachedPost: CachedPost;
  membersCount: number;
};

const ExtendedPost: React.FC<ExtendedPostProps> = ({
  sessionUser,
  post,
  cachedPost,
  membersCount,
}) => {
  const router = useRouter();
  const createdAt = formatDistanceToNow(
    new Date(post?.createdAt ?? cachedPost.createdAt),
    {
      addSuffix: true,
    },
  );

  const { mutate: deletePost, isLoading } = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/posts/${post?.id ?? cachedPost.id}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully.");
      router.back();
    },
    onError: (err) => {
      toast.error("Something went wrong.");
    },
  });

  if (!post && !cachedPost) return null;

  return (
    <div className="w-full overflow-hidden rounded-r-md p-2">
      <div className="flex items-center">
        <HoverCard openDelay={450}>
          <HoverCardTrigger>
            <div className="flex cursor-pointer items-center gap-2">
              <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
                {/* <AvatarImage
                  src={post?.subreddit.image! ?? cachedPost.subreddit.image}
                /> */}
                <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                  r/
                </AvatarFallback>
              </Avatar>
              <p
                onClick={() => {}}
                className="text-xs font-bold text-zinc-900 hover:underline dark:text-zinc-50"
              >
                r/{post?.subreddit.name ?? cachedPost.subreddit.name}
              </p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="absolute -left-5 z-[999] flex h-fit min-w-[150px] flex-col gap-2 rounded-md border-[1px] border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-700 dark:bg-zinc-900">
            <div className="flex items-center gap-1.5">
              <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-sky-600">
                {/* <AvatarImage
                  src={post?.subreddit.image ?? cachedPost.subreddit.image!}
                /> */}
                <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                  r/
                </AvatarFallback>
              </Avatar>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                r/{post?.subreddit.name ?? cachedPost.subreddit.name}
              </p>
            </div>

            <p className="flex flex-col items-start text-xs text-neutral-500">
              <span className="text-base text-zinc-900 dark:text-zinc-50">
                {membersCount}
              </span>
              Members
            </p>

            <Button
              className="black-style_btn"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.push(
                  `/r/${post?.subreddit.name ?? cachedPost.subreddit.name}`,
                );
              }}
            >
              View Community
            </Button>
          </HoverCardContent>
        </HoverCard>

        <Dot className="text-neutral-500" size={17} />

        <p className="text-xs text-neutral-500">Posted by&nbsp;</p>
        <HoverCard openDelay={450}>
          <HoverCardTrigger>
            <p
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.push(
                  `/user/${post?.author.username ?? cachedPost.authorUsername}`,
                );
              }}
              className="cursor-pointer text-xs text-neutral-500 hover:underline"
            >
              u/{post?.author.username ?? cachedPost.authorUsername}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="absolute -left-5 z-[999] flex h-fit min-w-[150px] flex-col gap-2 rounded-md border-[1px] border-zinc-200 bg-zinc-50 p-3 dark:border-neutral-700 dark:bg-zinc-900">
            <div className="flex items-center gap-1.5">
              <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-sky-600">
                <AvatarImage src={post?.author.imageUrl!} />
                <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                  r/
                </AvatarFallback>
              </Avatar>
              <p className="flex flex-col text-xs font-bold text-zinc-900 dark:text-zinc-50">
                {post?.author.name}
                <span className="font-normal text-neutral-500">
                  u/{post?.author.username}
                </span>
              </p>
            </div>

            <Button
              className="black-style_btn mt-4"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.push(
                  `/user/${post?.author.username ?? cachedPost.authorUsername}`,
                );
              }}
            >
              View Profile
            </Button>
          </HoverCardContent>
        </HoverCard>

        <p className="max-h-40 truncate text-xs text-zinc-500">
          &nbsp;{createdAt}
        </p>
      </div>

      <div className="relative my-1.5 flex flex-col items-start gap-1.5">
        <h1 className="w-11/12 break-words text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {post?.title ?? cachedPost.title}
        </h1>
        <EditorOutput
          content={JSON.parse(
            JSON.stringify(post?.content ?? cachedPost.content),
          )}
        />
      </div>

      <div className="z-10 -ml-2 flex w-full items-center gap-x-3 bg-zinc-50 dark:bg-zinc-900">
        <p className="flex w-fit items-center gap-1 rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10">
          <MessageSquare size={17} />
          <span>{post?.comments?.length ?? "0"}</span>
          Comments
        </p>
        {(post
          ? sessionUser?.id === post.author.id
          : sessionUser?.username === cachedPost.authorUsername) && (
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10">
              <Trash size={17} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete post?</AlertDialogTitle>
              </AlertDialogHeader>
              <p>
                Are you sure you want to delete your post? This action is
                irreversible.
              </p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    deletePost();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <CommentForm
        onReply={() => {}}
        actionType="comment"
        postId={post?.id ?? cachedPost.id}
        postAuthorUsername={post?.author.username ?? cachedPost.authorUsername}
      />
    </div>
  );
};

export default ExtendedPost;
