import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { SuccessModalConnector } from './connector'

/**
 * Renders an success modal component.
 *
 * @param successMessage - The success message to be displayed in the modal.
 * @param clearSuccess - A function to clear the success and close the modal.
 * @returns The success modal component.
 */
function SuccessModal({ message, onClose }: SuccessModalConnector.Props) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={!!message} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="backgroundSecondary">
        <ModalHeader>Success</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SuccessModalConnector.Connector(SuccessModal)
