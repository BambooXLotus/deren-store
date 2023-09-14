import { BillboardForm } from "./components/BillboardForm";
import { prisma } from "@/server/db";

type BillboardPageProps = {
  params: { billboardId: string };
};

const BillBoardPage: React.FC<BillboardPageProps> = async ({ params }) => {
  const { billboardId } = params;

  const billboard = await prisma.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillBoardPage;
