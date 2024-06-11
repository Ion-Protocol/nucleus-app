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
import { ErrorModalConnector } from './connector'

/**
 * Renders an error modal component.
 *
 * @param errorMessage - The error message to be displayed in the modal.
 * @param clearError - A function to clear the error and close the modal.
 * @returns The error modal component.
 */
function ErrorModal({ errorMessage, clearError }: ErrorModalConnector.Props) {
  const handleClose = () => {
    clearError()
  }

  return (
    <Modal isOpen={!!errorMessage} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{errorMessage}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ErrorModalConnector.Connector(ErrorModal)
