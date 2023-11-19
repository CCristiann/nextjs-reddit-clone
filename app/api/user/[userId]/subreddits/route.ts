import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { currentUser } from "@/libs/auth";


export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Invalid session", { status: 400 });

    const userSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
      },
      include: {
        subreddit: true,
      },
    });

    const subreddits = await prisma.subreddit.findMany({
      where: {
        name: {
          in: userSubscriptions.map((sub) => sub.subreddit.name),
        },
      },
    });

    if (subreddits.length === 0)
      return NextResponse.json("User is not following any community.", {
        status: 404,
      });

    return NextResponse.json(subreddits, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch user subscribed subreddits.", {
      status: 500,
    });
  }
}
