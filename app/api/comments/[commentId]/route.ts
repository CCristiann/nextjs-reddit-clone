import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

type Props = {
  params: {
    commentId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    if (params.commentId) {
      await prisma.comment.deleteMany({
        where: {
          replyToId: params.commentId,
        },
      });

      await prisma.comment.delete({
        where: {
          id: params.commentId,
        },
      });

      return NextResponse.json("OK", { status: 200 });
    }

    throw new Error("Invalid ID");
  } catch (err) {
    console.log(err);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
