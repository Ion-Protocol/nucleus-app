import { Flex } from '@chakra-ui/react'
import { ErrorIcon } from './icons/ErrorIcon'
import { CheckIcon } from './icons/Check'

export function FullSuccessIcon() {
  return (
    <Flex h="80px" w="80px" borderRadius="100px" align="center" justify="center" bg="success.background">
      <Flex h="60px" w="60px" borderRadius="100px" align="center" justify="center" bg="success.iconBg">
        <Flex h="28px" w="28px" borderRadius="4px" align="center" justify="center" bg="success.main">
          <CheckIcon fontSize="18px" color="white" />
        </Flex>
      </Flex>
    </Flex>
  )
}
