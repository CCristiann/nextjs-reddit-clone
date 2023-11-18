import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React from "react";

import Skeleton from "react-loading-skeleton";

const LoadingComment = () => {
  return (
    <div className="z-0 flex w-full rounded-md bg-zinc-50 dark:bg-zinc-900 md:flex-row">
      <div className="p-1 md:p-2.5">
        <Skeleton circle width={24} height={24} />
      </div>
      <div className="z-0 flex w-full flex-col rounded-md p-2">
        <div className="flex items-center">
          <Skeleton width={180} height={15} />
        </div>

        <div className="relative flex flex-col items-start overflow-clip">
          {/* Body */}
          <div className="w-3/4">
            <Skeleton className="w-full" height={10} />
          </div>
          <div className="w-5/6">
            <Skeleton className="w-full" height={10} />
          </div>
          <div className="w-2/5">
            <Skeleton className="w-full" height={10} />
          </div>
          <div className="w-4/6">
            <Skeleton className="w-full" height={10} />
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
