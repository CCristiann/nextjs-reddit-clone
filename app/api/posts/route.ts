import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

import { z } from "zod";
import { currentUser } from "@/libs/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    const url = new URL(req.url);

    const { limit, page, subredditName, userId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
        userId: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        subredditName: url.searchParams.get("subredditName"),
        userId: url.searchParams.get("userId"),
      });

    let whereClause = {};

    //Where clause to get posts of a specific subreddit
    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    }

    //Where clause to get user followed subreddits' posts
    if (user && !subredditName) {
      if (userId) {
        whereClause = {
          authorId: userId,
        };
      } else {
        const followedCommunities = await prisma.subscription.findMany({
          where: {
            userId: user.id,
          },
          include: {
            subreddit: true,
          },
        });

        whereClause = {
          subreddit: {
            name: {
              in: followedCommunities.map((sub) => sub.subreddit.name),
            },
          },
        };
      }
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: {
          include: {
            _count: true,
          },
        },
        author: true,
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch posts", { status: 500 });
  }
}
