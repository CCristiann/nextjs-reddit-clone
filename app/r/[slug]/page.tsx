import Link from "next/link";
import MiniCreatePost from "@/components/MiniCreatePost";
import prisma from "@/libs/prismadb";
import { notFound } from "next/navigation";
import PostsFeed from "@/components/posts/PostsFeed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import SubredditHero from "@/components/subreddit/SubredditHero";
import RulesSidebar from "@/components/sidebars/RulesSidebar";
import SubredditInfoSidebar from "@/components/sidebars/SubredditInfoSidebar";
import { currentUser } from "@/libs/auth";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const user = await currentUser();

  const { slug } = params;

  const subreddit = await prisma.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  const subscription = !user
    ? undefined
    : await prisma.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  return (
    <>
      <SubredditHero subreddit={subreddit} isSubscribed={isSubscribed} />
      <div className="page-paddings mx-auto h-fit w-full max-w-5xl">
        <div>
          {/* <ToFeedButton /> */}
          <div className="grid grid-cols-1 gap-y-4 py-2 md:grid-cols-3 md:gap-x-3 md:py-6">
            <ul className="col-span-2 flex h-fit w-full flex-col gap-2 md:gap-3">
              <Link href={`/r/${params.slug}/submit`}>
                <MiniCreatePost user={user} />
              </Link>
              <PostsFeed
                initialPosts={subreddit.posts}
                subredditName={subreddit.name}
                user={user}
              />
            </ul>

            {/* info sidebar */}
            <SubredditInfoSidebar subreddit={subreddit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
