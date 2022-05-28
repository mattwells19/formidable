import {
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import type { FC } from "react";

interface IFormSubmissionModalProps {
  formValues: any;
  onClose: () => void;
}

const FormSubmissionModal: FC<IFormSubmissionModalProps> = ({
  formValues,
  onClose,
}) => {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={Boolean(formValues)}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Final Form Values</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="5">
          <Code width="full">
            <pre>{JSON.stringify(formValues, undefined, 2)}</pre>
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormSubmissionModal;
