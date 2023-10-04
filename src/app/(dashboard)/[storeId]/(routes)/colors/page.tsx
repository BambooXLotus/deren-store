import { ColorsClient } from "./components/Client";
import { type ColorColumn } from "./components/Columns";
import { prisma } from "@/server/db";
import { format } from "date-fns";

type ColorsPageProps = {
  params: { storeId: string };
};

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
  const { storeId } = params;

  const colors = await prisma.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
