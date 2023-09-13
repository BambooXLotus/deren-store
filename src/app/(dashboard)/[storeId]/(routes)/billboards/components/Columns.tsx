"use client";

import { CellAction } from "./CellAction";
import { Button } from "@/components/ui/Button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const Columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
