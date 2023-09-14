import { CategoryForm } from "./components/CategoryForm";
import { prisma } from "@/server/db";

type CategoryPageProps = {
  params: {
    storeId: string;
    categoryId: string;
  };
};

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const { storeId, categoryId } = params;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
