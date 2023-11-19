"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrevious } from "@mantine/hooks";
import { useMutation } from "react-query";

import { CommentVoteRequest } from "@/libs/validators/vote";
import { CommentVote as CommentVoteType, VoteType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";




type PartialVote = Pick<CommentVoteType, "type">;

type CommentVoteProps = {
  commentId: string;
  votesAmt: number;
  currentVote?: PartialVote;
};

const CommentVote: React.FC<CommentVoteProps> = ({
  commentId,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
}) => {
  const router = useRouter();
  const [votesAmount, setVotesAmount] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    _currentVote,
  );
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(currentVote);
  }, [currentVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      const { data } = await axios.patch(
        "/api/subreddit/post/comment/vote",
        payload,
      );
      return data;
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmount((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
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
              currentVote?.type === "UP" &&
              "fill-orange-600 text-orange-600 hover:text-orange-600"
            } 
            ${currentVote?.type !== "UP" && "text-neutral-500"} 
          `}
        />
      </Button>

      <span
        className={`
        ${currentVote?.type == "UP" && "text-orange-600"}
        ${currentVote?.type === "DOWN" && "text-sky-600"}
        ${
          currentVote?.type !== "UP" &&
          currentVote?.type !== "DOWN" &&
          "text-neutral-500"
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
              currentVote?.type === "DOWN" &&
              "fill-sky-600 text-sky-600 hover:text-sky-600"
            }
            ${currentVote?.type !== "DOWN" && "text-neutral-500"}
          `}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
