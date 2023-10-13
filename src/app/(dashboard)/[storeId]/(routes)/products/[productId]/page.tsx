import { ProductForm } from "./components/ProductForm";
import { prisma } from "@/server/db";

type ProductPageProps = {
  params: {
    productId: string;
    storeId: string;
  };
};

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId, storeId } = params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
  });

  const colors = await prisma.color.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prisma.size.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
