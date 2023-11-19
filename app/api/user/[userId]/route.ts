import { EditUserValidator } from "@/libs/validators/user";
import { currentUser } from "@/libs/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/libs/prismadb";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json("Unathorized.", { status: 401 });

    const body = await req.json();
    const { username } = EditUserValidator.parse(body);

    const editedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username
      },
    });

    return NextResponse.json(editedUser, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.message, { status: 400 });
    }

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002")
        return NextResponse.json("This username is already taken.", {
          status: 400,
        });
    }

    return NextResponse.json("Something went wrong. Please try later.", {
      status: 500,
    });
  }
}
