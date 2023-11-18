import { SubredditCreationValidator } from "@/libs/validators/subreddit";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import { z } from "zod";
import { currentUser } from "@/libs/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json("Unathorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = SubredditCreationValidator.parse(body);

    const subredditExists = await prisma.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return NextResponse.json("Subreddit name is already taken.", {
        status: 409,
      });
    }

    const newSubreddit = await prisma.subreddit.create({
      data: {
        name,
        creatorId: user.id,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        subredditId: newSubreddit.id,
      },
    });

    return NextResponse.json(newSubreddit, { status: 200 });
  } catch (err) {
    return NextResponse.json("Something went wrong. Please try later.", {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const { subredditName } = z
      .object({
        subredditName: z.string(),
      })
      .parse({
        subredditName: url.searchParams.get("subredditName"),
      });

    const subreddit = await prisma.subreddit.findUnique({
      where: {
        name: subredditName,
      },
    });

    if (!subreddit)
      return NextResponse.json("Subreddit not found.", { status: 404 });

    return NextResponse.json(subreddit, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch the subreddit", { status: 500 });
  }
}
