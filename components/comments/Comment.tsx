"use client";

import {
  Comment as CommentType,
  CommentVote as CommentVoteType,
  User,
} from "@prisma/client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import EditorOutput from "../editor/EditorOutput";
import CommentVote from "./vote/CommentVote";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { Dot, MessageSquare, Trash } from "lucide-react";
import CommentForm from "../forms/CommentForm";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/Alert-dialog";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";

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
  const queryClient = useQueryClient();
  const router = useRouter();
  const createdAt = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const [isReplying, setIsReplying] = useState<boolean>(false);

  const { mutate: deleteComment, isLoading } = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/comments/${comment.id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully.");
      queryClient.invalidateQueries(["fetch-comments"]);
    },
    onError: (err) => {
      toast.error("Something went wrong.");
    },
  });

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
          <div className="flex items-center">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              u/{comment.author.username}
            </p>

            <Dot className="text-neutral-500" size={17} />

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

            {user?.id === comment.author.id && (
              <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer rounded-sm p-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-500 hover:bg-opacity-10">
                  <Trash size={17} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p>
                    Are you sure you want to delete your comment? This action is
                    irreversible.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        deleteComment();
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
