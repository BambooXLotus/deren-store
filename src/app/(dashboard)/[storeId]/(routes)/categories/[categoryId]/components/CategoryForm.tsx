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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import {
  CategoryFormValidator,
  type CategoryRequest,
} from "@/lib/validators/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Billboard, type Category } from "@prisma/client";
import { SelectValue } from "@radix-ui/react-select";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type CategoryFormProps = {
  initialData: Category | null;
  billboards: Billboard[];
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<CategoryRequest>({
    resolver: zodResolver(CategoryFormValidator),
    defaultValues: initialData ?? {
      name: "",
      billboardId: "",
    },
  });

  const storeId = params.storeId as string;
  const categoryId = params.categoryId as string;

  const { mutate: addCategory, isLoading: isAddLoading } = useMutation({
    mutationFn: async (values: CategoryRequest) => {
      const { data } = await axios.post<Category>(
        `/api/${storeId}/categories`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Category created.");
        router.refresh();
        router.push(`/${storeId}/categories`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: editCategory, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: CategoryRequest) => {
      const { data } = await axios.patch<Category>(
        `/api/${storeId}/categories/${categoryId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Category updated.");
        router.refresh();
        router.push(`/${storeId}/categories`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteCategory, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/categories/${categoryId}`);
    },
    onSuccess: () => {
      toast.success("Category Deleted.");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(
        "Make sure you removed all products using this category first."
      );
    },
    onSettled: () => {
      router.refresh();
      router.push(`/${storeId}/categories`);
    },
  });

  const isLoading = isAddLoading || isEditLoading || isDeleteLoading;

  function onSubmit(data: CategoryRequest) {
    if (initialData) {
      editCategory(data);
    } else {
      addCategory(data);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteCategory()}
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
