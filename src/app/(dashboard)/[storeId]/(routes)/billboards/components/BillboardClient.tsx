"use client";

import { Columns, type BillboardColumn } from "./Columns";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type BillboardClientProps = {
  data: BillboardColumn[];
};

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const storeId = params.storeId as string;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={Columns} data={data} />
    </>
  );
};
