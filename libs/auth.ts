import prisma from "@/libs/prismadb";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";

export const currentUser = async () => {
  const clerkUser = await clerkCurrentUser()

  if (clerkUser) {
    const dbUser = await prisma.user.findUnique({
      where: {
        externalId: clerkUser.id
      }
    })
    if(!dbUser) return 
 

    const updatedDbUser = await prisma.user.update({
      where: {
        id: dbUser.id
      },
      data: { 
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        imageUrl: clerkUser.imageUrl
      }
    })
   
    return updatedDbUser as User
  } else {
    return null
  }
};
