import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    if (!query) return NextResponse.json("Invalid query.", { status: 400 });

    const subreddits = await prisma.subreddit.findMany({
      where: {
        name: {
          contains: query.toLowerCase() && query.toUpperCase() && query,
        },
      },
      include: {
        _count: true,
      },

      take: 5,
    });

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query.toLowerCase() && query.toUpperCase() && query,
        },
      },
      include: {
        _count: true,
      },
      take: 5,
    });

    if (!subreddits && !users) return NextResponse.json(null, { status: 200 });
    return NextResponse.json(
      { subreddits: subreddits, users: users },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json("Something went wrong. Please try later.", {
      status: 500,
    });
  }
}
