import { PostValidator } from "@/libs/validators/post";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import { z } from "zod";
import { currentUser } from "@/libs/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized.", { status: 401 });

    const body = await req.json();
    const { subredditId, content, title } = PostValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: user.id,
      },
    });

    if (!subscriptionExists) {
      return NextResponse.json("Subscribe to start posting.", { status: 400 });
    }

    await prisma.post.create({
      data: {
        title,
        subredditId,
        content,
        authorId: user.id,
      },
    });

    return NextResponse.json(subredditId, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.message, { status: 400 });
    }

    return NextResponse.json("Failed to create post.", { status: 500 });
  }
}
