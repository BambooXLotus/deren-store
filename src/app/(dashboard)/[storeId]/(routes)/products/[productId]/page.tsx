import { ProductForm } from "./components/ProductForm";
import { prisma } from "@/server/db";

type ProductPageProps = {
  params: { productId: string };
};

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const { productId } = params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
