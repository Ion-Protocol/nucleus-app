import { Flex } from '@chakra-ui/react'
import { ErrorIcon } from './icons/ErrorIcon'

export function FullErrorIcon() {
  return (
    <Flex h="80px" w="80px" borderRadius="100px" align="center" justify="center" bg="error.background">
      <Flex h="60px" w="60px" borderRadius="100px" align="center" justify="center" bg="error.iconBg">
        <ErrorIcon fontSize="28px" color="error.main" />
      </Flex>
    </Flex>
  )
}
