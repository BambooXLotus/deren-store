import { ProductClient } from "./components/Client";
import { type ProductColumn } from "./components/Columns";
import { currencyFormatter } from "@/lib/utils";
import { prisma } from "@/server/db";
import { format } from "date-fns";

type ProductsPageProps = {
  params: { storeId: string };
};

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
  const { storeId } = params;

  const products = await prisma.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: currencyFormatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
