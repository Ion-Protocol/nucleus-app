import {
  Text,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Checkbox,
} from '@chakra-ui/react'
import { TermsModalConnector } from './connector'
import { Terms } from '@/components/config/Terms'
import { TermsIcon } from '../../icons/Terms'
import { terms } from '@/components/config/terms'
import { FullTermsIcon } from '../../FullTermsIcon'
import { useState } from 'react'

function TermsModal({ isOpen, onAccept }: TermsModalConnector.Props) {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)

  function handleAccept() {
    onAccept()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bg="backgroundSecondary">
        <Flex direction="column" align="center" pt={9} gap={3}>
          <FullTermsIcon />
          <Text variant="bigParagraph">Terms & Conditions</Text>
          <Flex direction="column" align="center" gap={2}>
            <Flex h="500px" overflow="auto" mx={6} px={2} my={6}>
              <Text variant="medium" color="secondaryText">
                {terms}
              </Text>
            </Flex>
          </Flex>
          <Checkbox onChange={() => setIsTermsAccepted(!isTermsAccepted)} isChecked={isTermsAccepted}>
            <Text variant="medium">I have read and agree to the terms & conditions</Text>
          </Checkbox>
        </Flex>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleAccept} isDisabled={!isTermsAccepted}>
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TermsModalConnector.Connector(TermsModal)
