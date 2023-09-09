"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
  StoreCreateValidator,
  type StoreCreateRequest,
} from "@/lib/validators/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type StoreModalProps = {
  id?: string;
};

export const StoreModal: React.FC<StoreModalProps> = () => {
  const storeModal = useStoreModal();
  const router = useRouter();

  const form = useForm<StoreCreateRequest>({
    resolver: zodResolver(StoreCreateValidator),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: StoreCreateRequest) => {
      const { data } = await axios.post<Store>("/api/stores", values);
      return data;
    },
    onSuccess: (store) => {
      // if (form.formState.isSubmitSuccessful) {
      //   toast.success("Store Created");
      //   form.reset({
      //     name: "",
      //   });
      // }
      // window.location.assign(`/${store.id}`);
      router.push(`/${store.id}`);
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something Wong!!!");
    },
  });

  function onSubmit(values: StoreCreateRequest) {
    mutate(values);
  }

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
