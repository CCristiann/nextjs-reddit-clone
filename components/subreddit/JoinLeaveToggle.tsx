"use client";
import React, { startTransition, useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { usePrevious } from "@mantine/hooks";

import { SubscribeToSubredditRequest } from "@/libs/validators/subreddit";

import { Button } from "../ui/Button";

type JoinLeaveToggleProps = {
  subreddit: Record<string, any>;
  isSubscribed: boolean;
};

const JoinLeaveToggle: React.FC<JoinLeaveToggleProps> = ({
  subreddit,
  isSubscribed: _isSubscribed,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isSubscribed, setIsSubscribed] = useState(_isSubscribed);
  const prevIsSubscribed = usePrevious(isSubscribed);

  const { mutate: subscribe } = useMutation({
    mutationKey: ["subscribe-subreddit"],
    mutationFn: async () => {
      const payload: SubscribeToSubredditRequest = {
        subredditId: subreddit.id,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data;
    },
    onMutate: () => {
      setIsSubscribed(!isSubscribed);
    },
    onError: (err) => {
      setIsSubscribed(prevIsSubscribed!);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Unathorized.");
          router.push("/sign-in");
        }
        return;
      }

      toast.error("There was a problem.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["followed-communities"]);
      startTransition(() => {
        router.refresh();
      });

      toast.success(`Successfully subscribed to r/${subreddit.name}`);
    },
  });

  const { mutate: unsubscribe } = useMutation({
    mutationKey: ["unsubscribe-subreddit"],
    mutationFn: async () => {
      const payload: SubscribeToSubredditRequest = {
        subredditId: subreddit.id,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data;
    },
    onMutate: () => {
      setIsSubscribed(!isSubscribed);
    },
    onError: (err) => {
      setIsSubscribed(prevIsSubscribed!);
      toast.error("There was a problem");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["followed-communities"]);

      startTransition(() => {
        router.refresh();
      });

      toast.success(`Successfully unsubscribed to r/${subreddit.name}`);
    },
  });

  const toggleSubscription = () => {
    if (isSubscribed) unsubscribe();
    else subscribe();
  };

  return (
    <Button
      className="mt-1 h-fit rounded-full px-4 py-1 text-xs md:px-6 md:text-sm"
      variant={`${isSubscribed ? "blue_outline" : "blue"}`}
      onClick={toggleSubscription}
    >
      {isSubscribed ? "Leave" : "Join"}
    </Button>
  );
};

export default JoinLeaveToggle;
