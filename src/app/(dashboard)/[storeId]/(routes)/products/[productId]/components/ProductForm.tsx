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
  ProductFormValidator,
  type ProductRequest,
} from "@/lib/validators/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Image, type Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type ProductPlus = Product & {
  images: Image[];
};

type ProductFormProps = {
  initialData: ProductPlus | null;
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ProductRequest>({
    resolver: zodResolver(ProductFormValidator),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const storeId = params.storeId as string;
  const productId = params.productId as string;

  const { mutate: addProduct, isLoading: isAddLoading } = useMutation({
    mutationFn: async (values: ProductRequest) => {
      const { data } = await axios.post<ProductPlus>(
        `/api/${storeId}/products`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Product created.");
        router.refresh();
        router.push(`/${storeId}/products`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: editProduct, isLoading: isEditLoading } = useMutation({
    mutationFn: async (values: ProductRequest) => {
      const { data } = await axios.patch<ProductPlus>(
        `/api/${storeId}/products/${productId}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      if (form.formState.isSubmitSuccessful) {
        toast.success("Product updated.");
        router.refresh();
        router.push(`/${storeId}/products`);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${storeId}/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Product Deleted.");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Make sure you removed all categories first.");
    },
    onSettled: () => {
      router.refresh();
      router.push(`/${storeId}/products`);
    },
  });

  const isLoading = isAddLoading || isEditLoading || isDeleteLoading;

  function onSubmit(data: ProductRequest) {
    if (initialData) {
      editProduct(data);
    } else {
      addProduct(data);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteProduct()}
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isLoading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="Product name"
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
