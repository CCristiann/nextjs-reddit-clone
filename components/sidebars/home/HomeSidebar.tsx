"use client";
import React from "react";

import Image from "next/image";
import { Button } from "../../ui/Button";

import { twMerge } from "tailwind-merge";
import HomeSidebarBtns from "./HomeSidebarBtns";

import HomePageBanner from "@/public/assets/images/home-banner.png";
import SnooHome from "@/public/assets/images/snoo-home.png";
import Loader from "@/components/Loader";

const HomeSidebar = () => {
  return (
    <div
      className={`
      sidebar
      ${twMerge("")}
    `}
    >
      {/* <div className="w-full h-[35px] relative z-0"> */}
      <Image src={HomePageBanner} alt="home-banner" className="object-cover" />
      {/* </div> */}

      <div className="flex flex-col px-3">
        <div className="-mt-4 mb-2.5 flex gap-2">
          <Image
            src={SnooHome}
            width={40}
            height={68}
            alt="Snoo home"
            className="z-10"
          />
          <h3 className="mb-1.5 self-end text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Home
          </h3>
        </div>
        <p className="mb-3 text-sm text-zinc-900 dark:text-zinc-50">
          Your personal Reddit frontpage. Come here to check in with your
          favorite communities.
        </p>

        <span className="mb-3 h-[1px] w-full bg-neutral-300 dark:bg-neutral-700"></span>
      </div>

      <HomeSidebarBtns />
    </div>
  );
};

export default HomeSidebar;
