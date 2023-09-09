import { SettingsForm } from "./components/SettingsForm";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
  params: { storeId },
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
