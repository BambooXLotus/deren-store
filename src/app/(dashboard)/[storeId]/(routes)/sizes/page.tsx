import { SizesClient } from "./components/Client";
import { type SizeColumn } from "./components/Columns";
import { prisma } from "@/server/db";
import { format } from "date-fns";

type SizesPageProps = {
  params: { storeId: string };
};

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const { storeId } = params;

  const sizes = await prisma.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
