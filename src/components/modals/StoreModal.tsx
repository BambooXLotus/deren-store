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
  StoreValidator,
  type StoreCreateRequest,
} from "@/lib/validators/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type StoreModalProps = {
  id?: string;
};

export const StoreModal: React.FC<StoreModalProps> = () => {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StoreCreateRequest>({
    resolver: zodResolver(StoreValidator),
    defaultValues: {
      name: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (values: StoreCreateRequest) => {
      const { data } = await axios.post<Store>("/api/store", values);
      return data;
    },
  });

  async function onSubmit(values: StoreCreateRequest) {
    //TODO: Create Store
    console.log(values);
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
                <Button d variant={"outline"} onClick={storeModal.onClose}>
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
