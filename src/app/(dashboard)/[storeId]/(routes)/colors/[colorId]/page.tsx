import { ColorForm } from "./components/ColorForm";
import { prisma } from "@/server/db";

type ColorPageProps = {
  params: { colorId: string };
};

const ColorPage: React.FC<ColorPageProps> = async ({ params }) => {
  const { colorId } = params;

  const size = await prisma.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ColorForm initialData={size} />
      </div>
    </div>
  );
};

export default ColorPage;
