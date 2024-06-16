import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React from "react";
import { Skeleton } from "../ui/ui/skeleton";

const LoadingComment = () => {
  return (
    <div className="z-0 flex w-full rounded-md bg-zinc-50 dark:bg-zinc-900 md:flex-row">
      <div className="p-1 md:p-2.5">
        <Skeleton className="h-[24px] w-[24px] rounded-full" />
      </div>
      <div className="z-0 flex w-full flex-col rounded-md p-2">
        <div className="flex items-center">
          <Skeleton className="h-4 w-[180px]" />
        </div>

        <div className="relative flex flex-col gap-y-1.5 my-3 items-start overflow-clip">
          {/* Body */}
          <div className="w-3/4">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-5/6">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-2/5">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-4/6">
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-l-md text-neutral-400 dark:text-neutral-600">
          <ArrowBigUp size={25} strokeWidth={1.5} />
          <ArrowBigDown size={25} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default LoadingComment;
