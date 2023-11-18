import CloseModal from "@/components/CloseModal";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

const SettingsProfilePage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="relative h-full w-fit md:h-4/5">
        <div className="absolute right-3 top-8 z-50 md:right-10 md:top-4">
          <CloseModal />
        </div>
        <UserProfile
          appearance={{
            elements: {
              modalCloseButton: "block",
              rootBox: "h-full",
              card: "rounded-none md:rounded-sm",
              scrollBox: "rounded-none md:rounded-sm",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SettingsProfilePage;
