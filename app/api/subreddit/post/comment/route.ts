import { CommentValidator } from "@/libs/validators/comment";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import { currentUser } from "@/libs/auth";
import { z } from "zod";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);

    const { limit, page, postId, userId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        postId: z.string().nullish().optional(),
        userId: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        postId: url.searchParams.get("postId"),
        userId: url.searchParams.get("userId"),
      });

    let whereClause;

    if (userId) {
      whereClause = {
        authorId: userId,
      };
    } else if (postId) {
      whereClause = {
        postId: postId,
      };
    }

    const comments = await prisma.comment.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      where: whereClause,
      include: {
        author: true,
        votes: true,
        replies: {
          include: {
            author: true,
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch comments", { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized.", { status: 401 });

    const body = await req.json();
    const { postId, replyToId, content } = CommentValidator.parse(body);

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: user.id,
        content,
        replyToId,
      },
    });

    return NextResponse.json(comment, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to create comment.", { status: 500 });
  }
}
