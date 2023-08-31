"use client";

import { StoreModal } from "@/components/modals/StoreModal";
import { useEffect, useState } from "react";

export const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal></StoreModal>
    </>
  );
};
