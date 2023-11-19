"use client";

import { Comment as CommentType, CommentVote, User } from "@prisma/client";

import { useInfiniteQuery } from "react-query";
import axios from "axios";
import Comment from "./Comment";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import LoadingComment from "./LoadingComment";

type ReplyComment = CommentType & {
  votes: CommentVote[];
  author: User;
};

type ExtendedComment = CommentType & {
  votes: CommentVote[];
  author: User;
  replies: ReplyComment[];
};
type CommentsFeedProps = {
  postId?: string;
  initialComments: ExtendedComment[];
  user: User | null;
};

const CommentsFeed: React.FC<CommentsFeedProps> = ({
  postId,
  user,
  initialComments,
}) => {
  const lastCommentRef = useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastCommentRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["fetch-comments"],
      async ({ pageParam = 1 }) => {
        let query;

        query = `/api/subreddit/post/comment?${postId ? `postId=${postId}` : user && `userId=${user.id}`}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;

        const { data } = await axios.get(query);
        return data;
      },

      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialComments], pageParams: [1] },
      },
    );

  //Fetch more comments after last comment fetched is intersecting the user screen
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const comments = data?.pages.flatMap((page) => page) ?? initialComments;

  return (
    <div className="flex flex-col">
      {comments.length === 0 && (
        <p className="mb-4 flex w-full items-center justify-center text-lg font-bold text-zinc-900 dark:text-zinc-50">
          There are no comments yet!
        </p>
      )}
      {comments
        .filter((comment: ExtendedComment) => !comment.replyToId)
        .map((topLevelComment: ExtendedComment, index: number) => {
          const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
            (acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            },
            0,
          );

          const topLevelCommentVote = topLevelComment.votes.find(
            (vote) => vote.userId === user?.id,
          );

          if (index === comments.length - 1) {
            return (
              <li
                key={topLevelComment.id}
                className="flex list-none flex-col"
                ref={ref}
              >
                <div className="mb-4">
                  <Comment
                    type="comment"
                    user={user}
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                  .map((reply: ReplyComment) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === user?.id,
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-4 border-l-2 border-zinc-200 pl-4 last:mb-4"
                      >
                        <Comment
                          type="reply"
                          user={user}
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                        />
                      </div>
                    );
                  })}
              </li>
            );
          } else {
            return (
              <div key={topLevelComment.id} className="flex flex-col" ref={ref}>
                <div className="mb-4">
                  <Comment
                    type="comment"
                    user={user}
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                  .map((reply: ReplyComment) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === user?.id,
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-4 border-l-2 border-input pl-4 last:mb-4"
                      >
                        <Comment
                          type="reply"
                          user={user}
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          }
        })}
      {isFetchingNextPage && (
        <>
          <LoadingComment />
          <LoadingComment />
        </>
      )}
    </div>
  );
};

export default CommentsFeed;
