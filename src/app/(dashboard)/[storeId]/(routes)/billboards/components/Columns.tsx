"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const Columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
