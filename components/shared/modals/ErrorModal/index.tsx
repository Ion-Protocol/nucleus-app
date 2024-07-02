import {
  Button,
  Code,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FullErrorIcon } from '../../FullErrorIcon'
import { ErrorModalConnector } from './connector'

/**
 * Renders an error modal component.
 *
 * @param errorMessage - The error message to be displayed in the modal.
 * @param clearError - A function to clear the error and close the modal.
 * @returns The error modal component.
 */
function ErrorModal({ error, clearError }: ErrorModalConnector.Props) {
  const [isFullModalOpen, setFullModalOpen] = useState(false)

  const handleClose = () => {
    clearError()
    setTimeout(() => {
      setFullModalOpen(false)
    }, 100)
  }

  const handleMoreClick = () => {
    setFullModalOpen(true)
  }

  const truncatedMessage =
    error.message && error.message.length > 250 ? `${error.message.slice(0, 250)}...` : error.message

  return (
    <>
      <Modal isOpen={!!error.message} onClose={handleClose} isCentered size={isFullModalOpen ? 'xl' : 'md'}>
        <ModalOverlay />
        <ModalContent bg="backgroundSecondary" border="1px solid" borderColor="border">
          <ModalCloseButton color="neutral.600" />
          <ModalBody>
            <Flex direction="column" align="center" pt={9} gap={3}>
              <FullErrorIcon />
              <Text variant="bigParagraph">{error.title}</Text>
              {isFullModalOpen ? (
                <Code
                  p={4}
                  w="100%"
                  maxH="50vh"
                  overflowY="auto"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  border="1px solid"
                  borderColor="border"
                  borderRadius="8px"
                  bg="code.background"
                >
                  {error.message}
                </Code>
              ) : (
                <Flex direction="column" align="center" gap={2}>
                  <Text variant="smallParagraphBold">
                    {truncatedMessage}
                    {error.message && error.message.length > 100 && (
                      <Link ml={3} fontSize="14px" color="link" onClick={handleMoreClick}>
                        Show More
                      </Link>
                    )}
                  </Text>
                </Flex>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex justify="center" w="100%" pb={6}>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ErrorModalConnector.Connector(ErrorModal)
