"use client";

import { CellAction } from "./CellAction";
import { Button } from "@/components/ui/Button";
import { ColorDot } from "@/components/ui/ColorDot";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const Columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <ColorDot backgroundColor={row.original.value} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
