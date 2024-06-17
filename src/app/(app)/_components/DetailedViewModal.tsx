"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

interface DetailedViewModalProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  children: React.ReactNode;
}

export default function DetailedViewModal({
  isModalOpen,
  onModalClose,
  children,
}: DetailedViewModalProps) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      size={["lg", "xl", "2xl", "5xl", "6xl", "6xl"]}
      isCentered
    >
      <ModalOverlay />
      <ModalContent className="w-full">
        <ModalCloseButton />
        <ModalBody className="m-auto">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
