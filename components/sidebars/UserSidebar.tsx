"use client";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";

import { User } from "@prisma/client";
import { getInitials } from "@/libs/utils";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { EditUserRequest, EditUserValidator } from "@/libs/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Check, Pencil, Settings } from "lucide-react";

import { Label } from "../ui/label";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import Loader from "../Loader";

type FormData = z.infer<typeof EditUserValidator>;

type UserSidebarProps = {
  user: User;
  sessionUser: User;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ user, sessionUser }) => {
  const router = useRouter();
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false)

  const isEditable = sessionUser.id === user.id;

  const { mutate: editUsername, isLoading } = useMutation({
    mutationKey: ["edit-user"],
    mutationFn: async ({ username }: EditUserRequest) => {
      const payload: EditUserRequest = { username };
      
      const { data } = await axios.post(`/api/user/${sessionUser.id}`, payload);
      return data as User;
    },
    onSuccess: (editedUser) => {
      toast.success("Username updated successfully.");
      setIsEditingUsername(false);
      router.push(`/user/${editedUser.username}`);
      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormData>({
    resolver: zodResolver(EditUserValidator),
    defaultValues: {
      username: user.username ?? sessionUser.username ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload: EditUserRequest = data;
    editUsername(payload);
  };


  return (
    <div className="order-first h-fit w-full overflow-hidden rounded-md bg-zinc-50 dark:bg-zinc-900 md:order-last">
      <div className="w-full flex-col space-y-2 p-3">
        <div className="relative h-20 w-20 rounded-full border-4 border-white">
          <Avatar className="h-full w-full">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="z-30 bg-zinc-50 dark:bg-zinc-900">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex w-full justify-between text-sm text-zinc-900 dark:text-zinc-50">
          <div className="flex flex-col space-y-1">
            <p className="font-bold ">{user.name}</p>
            <form id="username-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center space-x-2 text-xs -mt-2">
                <div className="flex">
                  <span>u/</span>
                  <Label hidden htmlFor="username" />
                  <input
                    id="username"
                    {...register("username")}
                    disabled={!isEditingUsername}
                    defaultValue={user.username! || sessionUser.username!}
                    className="max-w-[80px] bg-transparent outline-0 ring-0"
                  />
                </div>
                {isEditable && (
                  <>
                    <Button
                      type="button"
                      className={`
                                ${
                                  isEditingUsername
                                    ? "text-zinc-900 dark:text-zinc-50"
                                    : "text-neutral-500 dark:text-neutral-500"
                                }
                                rounded-md p-2
                                `}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingUsername(!isEditingUsername);
                      }}
                    >
                      <Pencil className="h-3 w-3" strokeWidth={3} />
                    </Button>
                    {isEditingUsername && (
                      <>
                        {isLoading ? (
                          <div
                            className={`${buttonVariants({
                              variant: "ghost",
                            })} rounded-md`}
                          >
                            <Loader size="sm" className="h-3 w-3" />
                          </div>
                        ) : (
                          <>
                            <Button
                              type="submit"
                              className="rounded-md p-2"
                              variant={"ghost"}
                              form="username-form"
                              disabled={!isValid}
                            >
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </form>
          </div>

          {isEditable && (
            <Link href={`/settings`}>
              <Settings className="h-5 w-5 cursor-pointer" />
            </Link>
          )}
        </div>
      </div>

      <div className="w-full flex-col space-y-2 p-3">
        {sessionUser.id === user.id ? (
          <Button
            onClick={() => router.push(`/submit`)}
            variant={"blue"}
            className="w-full rounded-full"
          >
            New Post
          </Button>
        ) : (
          <Button
            onClick={() => {}}
            variant={"blue"}
            className="w-full rounded-full"
          >
            Follow
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
