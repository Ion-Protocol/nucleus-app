import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { FullSuccessIcon } from '../../FullSuccessIcon'
import { IonTag } from '../../IonTag'
import { SuccessModalConnector } from './connector'
import { useState } from 'react'

function TransactionSuccessModal({ message, txHash, onClose }: SuccessModalConnector.Props) {
  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Modal isOpen={!!message} onClose={handleClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent bg="backgroundSecondary" border="1px solid" borderColor="border">
          <ModalCloseButton color="neutral.600" />
          <ModalBody>
            <Flex direction="column" align="center" pt={9} gap={3}>
              <FullSuccessIcon />
              <Text variant="bigParagraph">Transaction Complete</Text>
              <IonTag txHash={txHash || '0x0'} gap={1}>
                {txHash}
              </IonTag>
              <Flex direction="column" align="center" gap={2}>
                <Text textAlign="center" variant="smallParagraphBold">
                  {message}
                </Text>
              </Flex>
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

export default SuccessModalConnector.Connector(TransactionSuccessModal)
