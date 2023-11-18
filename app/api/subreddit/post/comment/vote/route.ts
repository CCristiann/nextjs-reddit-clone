import { currentUser } from "@/libs/auth";
import { CommentVoteValidator } from "@/libs/validators/vote";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import prisma from "@/libs/prismadb";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized", { status: 401 });

    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const existingVote = await prisma.commentVote.findFirst({
      where: {
        commentId,
        userId: user.id,
      },
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json("Comment not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.commentVote.delete({
          where: {
            id: existingVote.id,
            commentId,
            userId: user.id,
          },
        });

        return NextResponse.json("OK", { status: 200 });
      }

      await prisma.commentVote.update({
        where: {
          id: existingVote.id,
          commentId,
          userId: user.id,
        },
        data: {
          type: voteType,
        },
      });

      return NextResponse.json("OK", { status: 200 });
    }

    await prisma.commentVote.create({
      data: {
        type: voteType,
        commentId,
        userId: user.id,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json("Invalid request data passed", { status: 422 });
    } else {
      return NextResponse.json(
        "Could not vote for this post. Please try later.",
        { status: 500 },
      );
    }
  }
}
