import UserSidebar from "@/components/sidebars/UserSidebar";
import React from "react";
import prisma from "@/libs/prismadb";
import { currentUser } from "@/libs/auth";
import { notFound } from "next/navigation";
import PostsFeed from "@/components/posts/PostsFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import CommentsFeed from "@/components/comments/CommentsFeed";

type UserProfilePageProps = {
  params: {
    username: string;
  };
};

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) return notFound();

  const initialUserPosts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  });

  const initialUserComments = await prisma.comment.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      votes: true,
      author: true,
      replies: {
        include: {
          votes: true,
          author: true,
        },
      },
    },
  });

  const sessionUser = await currentUser();

  return (
    <div className="page-paddings mx-auto h-fit w-full max-w-5xl">
      <div className="flex grid-cols-1 flex-col-reverse gap-y-2 py-2 md:grid md:grid-cols-3 md:gap-x-3 md:py-6">
        <Tabs
          defaultValue="posts"
          className="relative col-span-2 flex h-fit w-full flex-col overflow-hidden"
        >
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="">
            <PostsFeed
              onlyUserPosts
              user={user}
              initialPosts={initialUserPosts}
              showSubreddit
            />
          </TabsContent>
          <TabsContent
            value="comments"
            className="rounded-md bg-zinc-50 pt-4 dark:bg-zinc-900"
          >
            <CommentsFeed user={user} initialComments={initialUserComments} />
          </TabsContent>
        </Tabs>

        {/* Home sidebar */}
        <div className="h-fit overflow-hidden md:sticky md:top-16">
          {user && sessionUser && (
            <UserSidebar user={user} sessionUser={sessionUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
