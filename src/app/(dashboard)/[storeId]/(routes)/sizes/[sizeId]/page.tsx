import { SizeForm } from "./components/SizeForm";
import { prisma } from "@/server/db";

type SizePageProps = {
  params: { sizeId: string };
};

const SizePage: React.FC<SizePageProps> = async ({ params }) => {
  const { sizeId } = params;

  const size = await prisma.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
