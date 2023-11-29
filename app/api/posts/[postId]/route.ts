import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

type Props = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    if (params.postId) {
      const post = await prisma.post.findUnique({
        where: {
          id: params.postId,
        },
        include: {
          votes: true,
        },
      });

      if (!post) return NextResponse.json("Post not found", { status: 404 });

      return NextResponse.json(post, { status: 200 });
    }

    throw new Error("Invalid ID");
  } catch (err) {
    return NextResponse.json("Failed to fetch post", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    if (params.postId) {
      await prisma.comment.updateMany({
        where: {
          postId: params.postId,
        },
        data: {
          replyToId: null,
        },
      });

      await prisma.comment.deleteMany({
        where: {
          postId: params.postId,
        },
      });

      await prisma.post.delete({
        where: {
          id: params.postId,
        },
        include: {
          votes: true,
          comments: true,
        },
      });

      return NextResponse.json("OK", { status: 200 });
    }

    throw new Error("Invalid ID");
  } catch (err) {
    console.log(err);
    return NextResponse.json("Failed to delete post", { status: 500 });
  }
}
