"use client";

import { Modal } from "@/components/ui/Modal";
import { useStoreModal } from "@/hooks/use-store-modal";

type StoreModalProps = {
  id?: string;
};

export const StoreModal: React.FC<StoreModalProps> = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  );
};
