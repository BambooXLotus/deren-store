import { MainNav } from "@/components/MainNav";
import { StoreSwitcher } from "@/components/StoreSwitcher";
import { prisma } from "@/server/db";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type NavbarProps = {
  id?: string;
};

export const Navbar: React.FC<NavbarProps> = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
