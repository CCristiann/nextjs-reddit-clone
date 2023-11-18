"use client";

import React, { useState, useReducer, useEffect } from "react";

import { QueryClient, useMutation, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

import { Input } from "../ui/Input";
import { Lock, User2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import {
  SubredditCreationRequest,
  SubredditCreationValidator,
} from "@/libs/validators/subreddit";
import { Subreddit } from "@prisma/client";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";

type FormData = z.infer<typeof SubredditCreationValidator>;

const CreateCommunityForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SubredditCreationValidator),
  });

  const { mutate: createSubreddit, isLoading } = useMutation({
    mutationFn: async ({ name }: SubredditCreationRequest) => {
      const payload: SubredditCreationRequest = { name };

      const { data } = await axios.post("/api/subreddit", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Unathorized.");
          router.push("/sign-in");
        } else {
          toast.error(err.response?.data);
        }
      } else {
        toast.error("Something went wrong please try later.");
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["followed-communities"]);
      toast.success("Subreddit created successfully.");
      router.push(`/r/${data.name}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload: SubredditCreationRequest = data;

    createSubreddit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="relative h-fit w-fit rounded-md bg-zinc-100 p-5 dark:bg-zinc-900">
        <div className="mb-4 flex flex-col gap-1 text-sm">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">Name</p>
          <p className="text-neutral-500">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative my-2.5 space-y-2 text-zinc-900 dark:text-zinc-50">
            <div>
              <Label hidden htmlFor="subredditName" />
              <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm">
                r/
              </p>
              <Input
                id="subredditName"
                type="text"
                className="pl-6 focus:border-blue-500 dark:border-neutral-700 dark:bg-zinc-900"
                {...register("name")}
              />
            </div>
          </div>
          {errors?.name && (
            <p className="-mt-2 px-1 text-xs font-medium text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            Community type
          </p>
          <div className="flex items-center gap-2">
            <input type="radio" name="community_type" id="public_community" />
            <label
              htmlFor="public_community"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            >
              <User2 size={14} />
              Public
              <span className="text-xs font-normal text-neutral-500">
                Anyone can view, post, and comment to this community
              </span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" name="community_type" id="private_community" />
            <label
              htmlFor="private_community"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            >
              <Lock size={14} />
              Private
              <span className="text-xs font-normal text-neutral-500">
                Only approved users can view and submit to this community
              </span>
            </label>
          </div>
        </div>

        <div className="my-2 flex w-full items-center justify-end gap-2.5 pt-5">
          <Button
            variant={"blue_outline"}
            className="rounded-full"
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"blue"}
            className="rounded-full"
            onClick={handleSubmit(onSubmit)}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityForm;
