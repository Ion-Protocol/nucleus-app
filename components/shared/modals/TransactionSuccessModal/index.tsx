import {
  Button,
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
import { FullSuccessIcon } from '../../FullSuccessIcon'
import { TxHashTag } from '../../IonTag'
import { SuccessModalConnector } from './connector'
import { layerZeroBaseUrl } from '@/config/constants'

function TransactionSuccessModal({ message, txHash, onClose, shouldShowLayerZeroLink }: SuccessModalConnector.Props) {
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
              <Text variant="smallParagraph">{message}</Text>
              {shouldShowLayerZeroLink && <Text>View the status of your bridge transaction here.</Text>}
              <TxHashTag txHash={txHash} gap={1} />
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
