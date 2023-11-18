"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/Button";
import {
  CommentCreationRequest,
  CommentValidator,
} from "@/libs/validators/comment";
import z from "zod";
import { currentUser } from "@/libs/auth";
import { Post, Subreddit, User, Vote } from "@prisma/client";
import { CachedPost } from "@/types/redis";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";
import axios, { Axios, AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Editor, EditorContent } from "@tiptap/react";
import { editorOptions } from "@/libs/tiptap";
import Toolbar from "../editor/Toolbar";

type FormData = z.infer<typeof CommentValidator>;

type CommentFormProps = {
  postId?: string;
  postAuthorUsername: string;
  actionType: "comment" | "reply";
  replyToId?: string;
  onReply: () => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  postAuthorUsername,
  actionType,
  replyToId,
  onReply,
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    setValue,
    resetField,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<FormData>({
    resolver: zodResolver(CommentValidator),
    defaultValues: {
      postId,
      replyToId,
    },
  });

  const editor = new Editor({
    ...editorOptions,
    onUpdate({ editor }) {
      setValue("content", {
        type: editor.getJSON().type!,
        content: editor.getJSON().content,
      });
    },
  });

  const { mutate: createComment } = useMutation({
    mutationKey: ["comment-creation"],
    mutationFn: async ({
      postId,
      content,
      replyToId,
    }: CommentCreationRequest) => {
      const payload: CommentCreationRequest = { postId, replyToId, content };

      const { data } = await axios.post("/api/subreddit/post/comment", payload);
      return data;
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      toast.success("Your post has been published.");
      queryClient.invalidateQueries(["fetch-comments"]);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast.error(err.message);
          return;
        }
      }
      toast.error("Something went wrong, please try later");
    },
    onSettled: () => {
      setIsSubmitting(false);
      resetField("content");
      editor.commands.clearContent();
      if (actionType === "reply") {
        onReply();
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload: CommentCreationRequest = data;
    createComment(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md bg-zinc-50 shadow-sm dark:bg-zinc-900"
    >
      <p className="my-1.5 text-xs text-zinc-900 dark:text-zinc-50">
        Comment as&nbsp;
        <Link
          href={`/user/${postAuthorUsername}`}
          className="text-sky-600 hover:underline"
        >
          {postAuthorUsername}
        </Link>
      </p>

      <Controller
        name="content"
        control={control}
        render={() => (
          <div className="flex flex-col">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )}
      />

      <Button
        type="submit"
        variant={"blue"}
        className="mt-3 w-full rounded-full text-base"
        disabled={isSubmitting}
      >
        {actionType === "comment" ? "Comment" : "Reply"}
      </Button>
    </form>
  );
};

export default CommentForm;
