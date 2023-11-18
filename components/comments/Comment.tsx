"use client";

import { Comment as CommentType, CommentVote as CommentVoteType, User } from "@prisma/client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import EditorOutput from "../editor/EditorOutput";
import CommentVote from "./vote/CommentVote";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import CommentForm from "../forms/CommentForm";

type ExtendedComment = CommentType & {
  votes: CommentVoteType[];
  author: User;
};

type CommentProps = {
  type: "comment" | "reply";
  user?: User | null;
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVoteType | undefined;
};

const Comment: React.FC<CommentProps> = ({
  type,
  user,
  comment,
  votesAmt,
  currentVote,
}) => {
  const router = useRouter();
  const createdAt = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const [isReplying, setIsReplying] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="p-1 md:p-2.5">
          <Avatar className="h-6 w-6">
            <AvatarFallback>CC</AvatarFallback>
            <AvatarImage src={comment.author.imageUrl} />
          </Avatar>
        </div>

        <div className="w-full px-2 py-1.5">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              u/{comment.author.username}
            </p>
            <p className="max-h-40 truncate text-xs text-zinc-500">
              {createdAt}
            </p>
          </div>

          <EditorOutput content={JSON.parse(JSON.stringify(comment.content))} />

          <div className="flex items-center gap-2">
            <CommentVote
              commentId={comment.id}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
            {type === "comment" && (
              <Button
                className="flex w-fit items-center gap-1 rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!user) return router.push("/sign-in");
                  setIsReplying(!isReplying);
                }}
              >
                <MessageSquare size={17} strokeWidth={1.5} />
                Reply
              </Button>
            )}
          </div>

          {isReplying && user?.username && (
            <div className="mb-4 ml-4 border-l-2 border-input pl-4">
              <CommentForm
                postId={comment.postId}
                actionType="reply"
                postAuthorUsername={user.username}
                replyToId={comment.id}
                onReply={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
