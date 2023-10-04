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
import { ColorFormValidator, type ColorRequest } from "@/lib/validators/color";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Color } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type ColorFormProps = {
  initialData: Color | null;
};

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ColorRequest>({
    resolver: zodResolver(ColorFormValidator),
    defaultValues: initialData ?? {
      name: "",
      value: "",
    },
  });

  const storeId = params.storeId as string;
  const colorId = params.colorId as string;

  const { mutate: addColor, isLoading: isAddLoading } = useMutation({
    mutationFn: async (values: ColorRequest) => {
      const { data } = await axios.post<Color>(
        `/api/${storeId}/colors`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Color created.");
        router.refresh();
        router.push(`/${storeId}/colors`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: editColor, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: ColorRequest) => {
      const { data } = await axios.patch<Color>(
        `/api/${storeId}/colors/${colorId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Color updated.");
        router.refresh();
        router.push(`/${storeId}/colors`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteColor, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
    },
    onSuccess: () => {
      toast.success("Color Deleted.");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Make sure you removed all products using this color first.");
    },
    onSettled: () => {
      router.refresh();
      router.push(`/${storeId}/colors`);
    },
  });

  const isLoading = isAddLoading || isEditLoading || isDeleteLoading;

  function onSubmit(data: ColorRequest) {
    if (initialData) {
      editColor(data);
    } else {
      addColor(data);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteColor()}
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
