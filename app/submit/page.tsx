import ChooseCommunity from "@/components/ChooseCommunity";
import RulesSidebar from "@/components/sidebars/RulesSidebar";
import React from "react";
import { currentUser } from "@/libs/auth";
import PostForm from "@/components/forms/PostForm";

const SubmitPage = async () => {
  const user = await currentUser();

  return (
    <div className="page-paddings mx-auto h-fit w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        <div className="col-span-2 flex h-fit w-full flex-col gap-3">
          <div className="h-fit w-full border-b-[1px] border-zinc-50 pb-4 dark:border-neutral-700">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 md:text-xl lg:text-xl">
              Create a post
            </h1>
          </div>

          {user && <ChooseCommunity user={user} />}

          {/* 
         // @ts-ignore */}
          <PostForm />
        </div>

        {/* Submit page sidebar */}
        <div className="sidebar-container flex flex-col justify-start gap-3">
          <RulesSidebar />
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
