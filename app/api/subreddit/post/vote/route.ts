import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import { redis } from "@/libs/redis";
import { ZodError, z } from "zod";
import { PostVoteValidator } from "@/libs/validators/vote";
import { CachedPost } from "@/types/redis";
import { currentUser } from "@/libs/auth";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized.", { status: 401 });

    const existingVote = await prisma.vote.findFirst({
      where: {
        postId: postId,
        userId: user.id,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
        subreddit: true,
      },
    });

    if (!post) return NextResponse.json("Post not found", { status: 404 });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
            postId,
            userId: user.id,
          },
        });

        return NextResponse.json("OK", { status: 200 });
      }

      await prisma.vote.update({
        where: {
          id: existingVote.id,
          postId,
          userId: user.id,
        },
        data: {
          type: voteType,
        },
      });

      const votesAmount = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmount >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
          subreddit: post.subreddit,
        };

        await redis.hset(`post: ${postId}`, cachePayload);
      }

      return NextResponse.json("OK", { status: 200 });
    }

    await prisma.vote.create({
      data: {
        type: voteType,
        postId,
        userId: user.id,
      },
    });

    const votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmount >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
        subreddit: post.subreddit,
      };

      await redis.hset(`post: ${postId}`, cachePayload);
    }

    return NextResponse.json("OK", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json("Invalid request data passed", { status: 422 });
    }

    return NextResponse.json(
      "Could not vote for this post. Please try later.",
      { status: 500 },
    );
  }
}
