import { currentUser } from "@/libs/auth";
import type { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmount?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
  displayOrizzontally?: boolean;
  bgTransparent?: boolean;
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const PostVoteServer = async ({
  postId,
  initialVotesAmount,
  initialVote,
  getData,
  displayOrizzontally,
  bgTransparent,
}: PostVoteServerProps) => {
  const user = await currentUser();
  let _votesAmount: number;
  let _currentVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    // fetch data in component
    const post = await getData();
    if (!post) return notFound();

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find((vote) => vote.userId === user?.id)?.type;
  } else {
    // passed as props
    _votesAmount = initialVotesAmount!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVoteAmount={_votesAmount}
      initialVote={_currentVote}
      displayOrizzontally={displayOrizzontally}
      bgTransparent={bgTransparent}
    />
  );
};

export default PostVoteServer;
