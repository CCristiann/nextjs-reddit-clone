"use client";

import { Post, Vote, VoteType } from "@prisma/client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { PostVoteRequest } from "@/libs/validators/vote";

import axios, { Axios, AxiosError } from "axios";
import { usePrevious } from "@mantine/hooks";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import debounce from "lodash.debounce";

type PostVoteClientProps = {
  postId: string;
  initialVoteAmount: number;
  initialVote?: VoteType | null;
  displayOrizzontally?: boolean;
  bgTransparent?: boolean;
};

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initialVoteAmount,
  initialVote,
  displayOrizzontally,
  bgTransparent,
}) => {
  const router = useRouter();
  const [votesAmount, setVotesAmount] = useState<number>(initialVoteAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      const { data } = await axios.patch("/api/subreddit/post/vote", payload);
      return data;
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmount((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote(type);
        if (type === "UP")
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmount((prev) => prev - 1);
      else setVotesAmount((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Must be logged in to start voting for posts.");
          router.push("/sign-in");
        }
      }
    },
  });

  if (displayOrizzontally) {
    return (
      <div className="flex items-center gap-x-1.5 rounded-l-md p-0.5">
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            vote("UP");
          }}
          className="rounded-sm p-0.5 md:p-1"
          variant={"ghost"}
        >
          <ArrowBigUp
            size={25}
            strokeWidth={1.5}
            className={`
              ${
                currentVote === "UP" &&
                "fill-orange-600 text-orange-600 hover:text-orange-600"
              } 
              ${currentVote !== "UP" && "text-neutral-500"} 
            `}
          />
        </Button>

        <span
          className={`
          ${currentVote == "UP" && "text-orange-600"}
          ${currentVote === "DOWN" && "text-sky-600"}
          ${
            currentVote !== "UP" && currentVote !== "DOWN" && "text-neutral-500"
          }
          text-sm font-semibold
        `}
        >
          {votesAmount}
        </span>

        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            vote("DOWN");
          }}
          className="rounded-sm p-0.5 md:p-1"
          variant={"ghost"}
        >
          <ArrowBigDown
            size={25}
            strokeWidth={1.5}
            className={`
              ${
                currentVote === "DOWN" &&
                "fill-sky-600 text-sky-600 hover:text-sky-600"
              }
              ${currentVote !== "DOWN" && "text-neutral-500"}
            `}
          />
        </Button>
      </div>
    );
  } else {
    return (
      <div
        className={`
      ${
        bgTransparent
          ? "bg-transparent"
          : "bg-zinc-100 dark:bg-zinc-950 dark:bg-opacity-40"
      }
      flex flex-col items-center gap-x-2 rounded-l-md p-0.5 text-neutral-400 dark:text-neutral-600 md:p-1.5
      `}
      >
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            vote("UP");
          }}
          className="rounded-sm p-0.5 md:p-1"
          variant={"ghost"}
        >
          <ArrowBigUp
            size={25}
            className={`
              ${
                currentVote === "UP" &&
                "fill-orange-600 text-orange-600 hover:text-orange-600"
              }    
            `}
          />
        </Button>

        <span
          className={`
          ${currentVote == "UP" && "text-orange-600"}
          ${currentVote === "DOWN" && "text-sky-600"}
          ${
            currentVote !== "UP" &&
            currentVote !== "DOWN" &&
            "text-zinc-900 dark:text-zinc-50"
          }
          text-sm font-semibold
        `}
        >
          {votesAmount}
        </span>

        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
          className="rounded-sm p-0.5 md:p-1"
          variant={"ghost"}
        >
          <ArrowBigDown
            size={25}
            className={`
              ${
                currentVote === "DOWN" &&
                "fill-sky-600 text-sky-600 hover:text-sky-600"
              }
            `}
          />
        </Button>
      </div>
    );
  }
};

export default PostVoteClient;
