import React from "react";
import { Subreddit, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

type PostPageHeaderProps = {
  subreddit?: Subreddit;
  user?: User;
};

const PostPageHeader: React.FC<PostPageHeaderProps> = ({ subreddit, user }) => {
  return (
    <div className="h-20 w-screen bg-sky-500">
      <div className="page-paddings mx-auto flex h-full max-w-5xl items-center gap-x-3 bg-transparent">
        <Avatar className="z-20 flex h-10 w-10 items-center justify-center border-2 border-white bg-sky-600">
          <AvatarImage
            className="font-bold text-zinc-50"
            src={`
                    ${subreddit && subreddit.image!}
                    ${user && user.imageUrl}
                `}
          />
          <AvatarFallback className="bg-transparent text-lg font-bold text-zinc-50">
            {subreddit && "/r"}
            {user && "u/"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-zinc-50">
          {subreddit && `r/${subreddit.name}`}
          {user && `u/${user.username}`}
        </h1>
      </div>
    </div>
  );
};

export default PostPageHeader;
