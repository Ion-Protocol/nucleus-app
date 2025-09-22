import { DEPRECATION_CONFIG } from '@/config/deprecation'
import { Box, Button, Flex, Image, Modal, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { CoinsSwap01 } from '@untitled-ui/icons-react'
import { DeprecationModalConnector } from './connector'

function DeprecationModal({ isOpen, onClose }: DeprecationModalConnector.Props) {
  const handleMigrateFunds = () => {
    localStorage.setItem(DEPRECATION_CONFIG.MODAL_DISMISSED_KEY, 'true')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent
        bg="backgroundSecondary"
        border="1px solid"
        borderColor="border"
        borderRadius="16px"
        boxShadow="shadow"
        maxW="692px"
        p={6}
      >
        <Flex direction="column" align="center" gap={6}>
          {/* Eyebrow Text */}
          <Text
            fontFamily="Reckless Neue"
            fontWeight={400}
            fontSize="20px"
            lineHeight="1em"
            color="textSecondary"
            textAlign="center"
          >
            Announcement Alert
          </Text>

          {/* Decorative Background */}
          <Box w="100%" h="300px" borderRadius="12px" bg="iconBackground" position="relative" overflow="hidden">
            <Image
              src="/assets/animations/deprecation-modal-background.gif"
              alt="Deprecation illustration"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>

          {/* Main Content */}
          <Flex direction="column" align="center" gap={2.5} maxW="468px">
            <Text
              fontFamily="PP Formula"
              fontWeight={500}
              fontSize="24px"
              lineHeight="1.2em"
              letterSpacing="-2%"
              color="text"
              textAlign="center"
            >
              Nucleus is being deprecated
            </Text>
            <Text
              fontFamily="ABC Diatype Variable Unlicensed Trial"
              fontWeight={400}
              fontSize="16px"
              lineHeight="1.3em"
              letterSpacing="-2%"
              color="textSecondary"
              textAlign="left"
            >
              Please migrate your funds and export your data to avoid interruption.
            </Text>
          </Flex>

          {/* Primary Action Button */}
          <Button variant="solid" leftIcon={<CoinsSwap01 width="16px" height="16px" />} onClick={handleMigrateFunds}>
            <Text variant="body-16">Migrate funds</Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  )
}

export default DeprecationModalConnector.Connector(DeprecationModal)
