"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SettingsMenu = () => {
  const pathName = usePathname();

  const SettingsMenuLinks = [
    {
      label: "Account",
      href: "/settings/account",
      isActive: pathName === "/settings/account" ? true : false,
    },
    {
      label: "Profile",
      href: "/settings/profile",
      isActive: pathName === "/settings/profile" ? true : false,
    },
  ];

  return (
    <div className="flex w-full items-center justify-start border-b border-neutral-300 dark:border-neutral-700">
      {SettingsMenuLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`
              border-b-4 p-2.5 text-sm font-bold transition hover:text-zinc-900 dark:hover:text-zinc-50
              ${
                link.isActive
                  ? "border-sky-600 text-zinc-900 dark:text-zinc-50"
                  : "border-transparent text-zinc-500"
              }
            `}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default SettingsMenu;
