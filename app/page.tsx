import CustomFeed from "@/components/posts/CustomFeed";
import GeneralFeed from "@/components/posts/GeneralFeed";

import MiniCreatePost from "@/components/MiniCreatePost";
import HomeSidebar from "@/components/sidebars/home/HomeSidebar";
import Link from "next/link";
import { currentUser } from "@/libs/auth";
import Image from "next/image";

const Home = async () => {
  const user = await currentUser();

  return (
    <div className="page-paddings mx-auto h-fit w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-y-4 py-2 md:grid-cols-3 md:gap-x-3 md:py-6">
        <div className="relative col-span-2 flex h-fit w-full flex-col gap-2 md:gap-3">
          <Link href="/submit">
            <MiniCreatePost user={user} />
          </Link>
          {user ? <CustomFeed user={user} /> : <GeneralFeed />}
        </div>

        {/* Home sidebar */}
        <div className="sidebar-container">
          <HomeSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
