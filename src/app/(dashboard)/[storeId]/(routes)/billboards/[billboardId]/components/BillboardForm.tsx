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
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import {
  BillboardFormValidator,
  type BillboardRequest,
} from "@/lib/validators/billboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Billboard } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type BillboardFormProps = {
  initialData: Billboard | null;
};

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<BillboardRequest>({
    resolver: zodResolver(BillboardFormValidator),
    defaultValues: initialData ?? {
      label: "",
      imageUrl: "",
    },
  });

  const storeId = params.storeId as string;
  const billboardId = params.billboardId as string;

  const { mutate: addBillboard, isLoading: isAddLoading } = useMutation({
    mutationFn: async (values: BillboardRequest) => {
      const { data } = await axios.post<Billboard>(
        `/api/${storeId}/billboards`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Billboard created.");
        router.refresh();
        router.push(`/${storeId}/billboards`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: editBillboard, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: BillboardRequest) => {
      const { data } = await axios.patch<Billboard>(
        `/api/${storeId}/billboards/${billboardId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Billboard updated.");
        router.refresh();
        router.push(`/${storeId}/billboards`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteBillboard, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
    },
    onSuccess: () => {
      toast.success("Billboard Deleted.");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Make sure you removed all categories first.");
    },
    onSettled: () => {
      router.refresh();
      router.push(`/${storeId}/billboards`);
    },
  });

  const isLoading = isAddLoading || isEditLoading || isDeleteLoading;

  function onSubmit(data: BillboardRequest) {
    if (initialData) {
      editBillboard(data);
    } else {
      addBillboard(data);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteBillboard()}
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
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
