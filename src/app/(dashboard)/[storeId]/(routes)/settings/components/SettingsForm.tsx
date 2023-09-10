"use client";

import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import {
  type StoreEditRequest,
  StoreEditValidator,
} from "@/lib/validators/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type SettingsFormProps = {
  initialData: Store;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const form = useForm<StoreEditRequest>({
    resolver: zodResolver(StoreEditValidator),
    defaultValues: initialData,
  });

  const storeId = params.storeId as string;

  const { mutate: editStore, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: StoreEditRequest) => {
      const { data } = await axios.patch<Store>(
        `/api/stores/${storeId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Store Updated.");
        router.refresh();
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteStore, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/stores/${storeId}`);
    },
    onSuccess: () => {
      toast.success("Store Deleted.");
      router.refresh();
      router.push("/");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Make sure you removed all products and categories first.");
    },
  });

  const isLoading = isEditLoading || isDeleteLoading;

  function onSubmit(data: StoreEditRequest) {
    editStore(data);
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteStore()}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          size="icon"
          disabled={isLoading}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};
