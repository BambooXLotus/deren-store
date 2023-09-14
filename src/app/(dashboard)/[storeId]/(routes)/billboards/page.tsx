import { BillboardClient } from "./components/Client";
import { type BillboardColumn } from "./components/Columns";
import { prisma } from "@/server/db";
import { format } from "date-fns";

type BillboardsPageProps = {
  params: { storeId: string };
};

const BillboardsPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const { storeId } = params;

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
