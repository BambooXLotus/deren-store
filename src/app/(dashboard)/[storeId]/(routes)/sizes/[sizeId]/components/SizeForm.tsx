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
import { SizeFormValidator, type SizeRequest } from "@/lib/validators/size";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Size } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type SizeFormProps = {
  initialData: Size | null;
};

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<SizeRequest>({
    resolver: zodResolver(SizeFormValidator),
    defaultValues: initialData ?? {
      name: "",
      value: "",
    },
  });

  const storeId = params.storeId as string;
  const sizeId = params.sizeId as string;

  const { mutate: addSize, isLoading: isAddLoading } = useMutation({
    mutationFn: async (values: SizeRequest) => {
      const { data } = await axios.post<Size>(`/api/${storeId}/sizes`, values);
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Size created.");
        router.refresh();
        router.push(`/${storeId}/sizes`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: editSize, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: SizeRequest) => {
      const { data } = await axios.patch<Size>(
        `/api/${storeId}/sizes/${sizeId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Size updated.");
        router.refresh();
        router.push(`/${storeId}/sizes`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteSize, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
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
      router.push(`/${storeId}/sizes`);
    },
  });

  const isLoading = isAddLoading || isEditLoading || isDeleteLoading;

  function onSubmit(data: SizeRequest) {
    if (initialData) {
      editSize(data);
    } else {
      addSize(data);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteSize()}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isLoading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
