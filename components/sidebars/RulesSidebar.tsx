import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

const RulesSidebar = () => {
  const rules = [
    {
      text: "Remember the human.",
    },
    {
      text: "Behave like you would in real life.",
    },
    {
      text: "Look for the original source of content.",
    },
    {
      text: "Search for duplicates before posting.",
    },
    {
      text: <p>Read the community&apos;s rules.</p>,
    },
  ];

  return (
    <div className="flex flex-col-reverse justify-end gap-3">
      <div
        className={`
      sidebar
      ${twMerge("p-3")}
    `}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-2 dark:border-neutral-700">
          <Image
            src="/assets/images/snoo-rules.svg"
            width={40}
            height={40}
            alt="snoo"
          />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Posting to Reddit
          </h3>
        </div>

        <ul>
          {rules.map((rule, index) => (
            <li
              key={index}
              className="flex gap-1 border-b border-zinc-200 py-2 text-sm font-medium dark:border-neutral-700"
            >
              {index + 1}. {rule.text}
            </li>
          ))}
        </ul>
      </div>
      <p className="w-full text-xs font-medium text-neutral-500">
        Please be mindful of reddit&apos;s content policy and practice good
        reddiquette.
      </p>
    </div>
  );
};

export default RulesSidebar;
