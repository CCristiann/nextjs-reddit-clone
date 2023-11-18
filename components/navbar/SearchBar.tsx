"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "../ui/Command";
import { CommandList } from "../ui/Command";
import { useQuery } from "react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import Link from "next/link";
import { Prisma, Subreddit, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import Loader from "../Loader";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setQuery("");
  });

  const {
    data: results,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["fetch-user-search"],
    queryFn: async () => {
      if (!query) return null;

      const { data } = await axios.get(`/api/search?query=${query}`);
      return data as {
        subreddits: (Subreddit & { _count: Prisma.SubredditCountOutputType })[];
        users: (User & { _count: Prisma.UserCountOutputType })[];
      };
    },
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <Command
      ref={commandRef}
      className={`
      ${query.length > 0 ? "rounded-t-md" : "rounded-md"}
      relative z-40 h-8 w-full overflow-visible rounded-t-md md:w-3/4 lg:w-2/4
    `}
    >
      <CommandInput
        className="h-8 border-none focus:outline-none focus:ring-0"
        isLoading={isFetching}
        onValueChange={(query: string) => {
          setQuery(query);
          debounceRequest();
        }}
        placeholder="Search communities..."
        value={query}
      />

      {query.length > 0 && !isFetching && (
        <CommandList className="absolute inset-x-0 top-full z-40 rounded-b-md border-none bg-white shadow-md dark:bg-black">
          {results?.subreddits.length == 0 && results?.users.length == 0 && (
            <div className="py-6 text-center text-sm font-normal text-zinc-900 dark:text-zinc-50">
              <p>Results not found.</p>
            </div>
          )}

          {(results?.subreddits.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {results?.subreddits.map((subreddit: Subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={() => {
                    router.push(`/r/${subreddit.name}`);
                    router.refresh();
                  }}
                  className="flex space-x-2"
                >
                  <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
                    <AvatarImage src={subreddit.image!} />
                    <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                      r/
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/r/${subreddit.name}`}>r/{subreddit.name}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          <CommandSeparator
            alwaysRender={
              results?.subreddits.length! > 0 && results?.users.length! > 0
                ? true
                : false
            }
          />

          {(results?.users.length ?? 0) > 0 ? (
            <CommandGroup heading="Users">
              {results?.users.map((user: User) => (
                <CommandItem
                  key={user.id}
                  value={user.username!}
                  onSelect={() => {
                    router.push(`/user/${user.username}`);
                    router.refresh();
                  }}
                  className="flex space-x-2"
                >
                  <Avatar className="flex h-6 w-6 items-center justify-center border-2 border-white bg-sky-600">
                    <AvatarImage src={user.imageUrl!} />
                    <AvatarFallback className="bg-transparent text-sm font-bold text-zinc-50">
                      u/
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/user/${user.username}`}>u/{user.username}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
