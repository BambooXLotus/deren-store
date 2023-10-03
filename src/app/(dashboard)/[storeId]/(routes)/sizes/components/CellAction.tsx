"use client";

import { type SizeColumn } from "./Columns";
import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

type CellActionProps = {
  data: SizeColumn;
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);

  const storeId = params.storeId as string;

  const { mutate: deleteSize, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/sizes/${data.id}`);
    },
    onSuccess: () => {
      toast.success("Size Deleted.");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Make sure you removed all products using this size first.");
    },
    onSettled: () => {
      router.refresh();
      setOpen(false);
    },
  });

  async function onCopy(id: string) {
    await navigator.clipboard.writeText(id).then(() => {
      toast.success("Size Id copied to clipboard.");
    });
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteSize}
        isLoading={isDeleteLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => void onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void router.push(`/${storeId}/sizes/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
