"use client";

import { Columns, type OrderColumn } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";

type OrderClientProps = {
  data: OrderColumn[];
};

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <DataTable columns={Columns} data={data} searchKey="products" />
    </>
  );
};
