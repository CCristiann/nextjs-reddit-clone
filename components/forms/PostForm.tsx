"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";

import { PostCreationRequest, PostValidator } from "@/libs/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { editorOptions } from "@/libs/tiptap";
import z from "zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import TextareaAutosize from "react-textarea-autosize";
import { Editor } from "@tiptap/react";
import { Button } from "../ui/Button";
import Toolbar from "../editor/Toolbar";
import { EditorContent } from "@tiptap/react";

type FormData = z.infer<typeof PostValidator>;

type PostFormProps = {
  subredditId: string;
};

const PostForm: React.FC<PostFormProps> = ({ subredditId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId };

      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast.error("Subriscibe to start posting.");
          return;
        }
      }
      toast.error("Something went wrong.");
      setIsSubmitting(false);
    },
    onSuccess: () => {
      // Turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathName.split("/").slice(0, -1).join("/");
      router.push(newPathname);

      router.refresh();

      toast.success("Your post has been published.");
      setIsSubmitting(false);
    },
  });

  const {
    setValue,
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId: subredditId,
      title: "",
      content: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload: PostCreationRequest = data;
    createPost(payload);
  };

  const editor = new Editor({
    ...editorOptions,
    onUpdate({ editor }) {
      setValue("content", editor.getJSON());
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md bg-zinc-50 p-3 shadow-sm dark:bg-zinc-900"
    >
      <Controller
        name="title"
        control={control}
        render={() => (
          <TextareaAutosize
            {...register("title")}
            placeholder="Title"
            maxLength={300}
            className="h-fit w-full resize-none appearance-none overflow-hidden break-words rounded-md border border-input bg-transparent bg-zinc-50 px-3 py-0.5 text-lg font-semibold text-zinc-900 placeholder-neutral-500 focus:outline-none focus:ring-0 dark:bg-zinc-900 dark:text-zinc-50"
          />
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <Toolbar image editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )}
      />

      <Button
        type="submit"
        variant={"blue"}
        className="mt-3 w-full rounded-full text-base"
        disabled={!isValid || isSubmitting}
      >
        Post
      </Button>
    </form>
  );
};

export default PostForm;
