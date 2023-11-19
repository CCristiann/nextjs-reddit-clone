import { SubredditSubscriptionValidator } from "@/libs/validators/subreddit";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { z } from "zod";
import { currentUser } from "@/libs/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized.", { status: 401 });

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: user.id,
      },
    });

    if (subscriptionExists) {
      return NextResponse.json(
        "You are already subscribed to this subreddit.",
        {
          status: 400,
        },
      );
    }

    await prisma.subscription.create({
      data: {
        subredditId,
        userId: user.id,
      },
    });

    return NextResponse.json(subredditId, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.message, { status: 400 });
    }

    return NextResponse.json("Something went wrong. Please try later.", {
      status: 500,
    });
  }
}
