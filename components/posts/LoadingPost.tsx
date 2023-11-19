import React from "react";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const LoadingPost = () => {
  return (
    <div className="z-0 flex flex-col-reverse rounded-md bg-zinc-50 shadow-md dark:bg-zinc-900 md:flex-row">
      <div className="flex items-center gap-2 rounded-l-md bg-zinc-100 p-1.5 text-neutral-400 dark:bg-zinc-950 dark:bg-opacity-40 dark:text-neutral-600 md:flex-col">
        <ArrowBigUp size={25} strokeWidth={1.5} />
        <ArrowBigDown size={25} strokeWidth={1.5} />
      </div>

      <div className="w-full p-2">
        <div className="flex items-center">
          <Skeleton width={180} height={15} />
        </div>

        <div className="relative my-1.5 flex flex-col items-start gap-1.5 overflow-clip">
          {/* Title */}
          <Skeleton width={300} height={20} />

          {/* Body */}
          <div className="w-full">
            <Skeleton className="w-full" height={310} />
          </div>
        </div>

        <div className="z-10 w-full bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <Skeleton width={120} height={15} />
            <Skeleton width={15} height={15} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPost;
