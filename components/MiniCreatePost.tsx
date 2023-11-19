"use client";
import React from "react";
import { User } from "@prisma/client";
import { getInitials } from "@/libs/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Input } from "./ui/Input";
import { Image, Link } from "lucide-react";


type MiniCreatePostProps = {
  user?: User | null;
};

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ user }) => {
  return (
    <div className="flex h-fit w-full items-center justify-around gap-2 rounded-md bg-zinc-50 px-1 py-1.5 shadow-sm dark:bg-zinc-900 md:p-2">
      <Avatar className="h-8 w-8">
        <AvatarImage alt="User profile image" src={user?.imageUrl}></AvatarImage>
        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
      </Avatar>

      <Input
        className="h-fit rounded-md border-gray-200 bg-zinc-100 p-1 placeholder:text-neutral-500 dark:border-neutral-700 dark:bg-zinc-800 md:h-9"
        type="text"
        placeholder="Create Post"
      />

      <button className="rouned-md relative h-7 w-7">
        <Image className="h-full w-full text-neutral-500" />
      </button>

      <button className="rouned-md relative h-7 w-7">
        <Link className="h-full w-full text-neutral-500" />
      </button>
    </div>
  );
};

export default MiniCreatePost;
