import { Flex } from '@chakra-ui/react'
import { CheckIcon } from './icons/Check'
import { TermsIcon } from './icons/Terms'

export function FullTermsIcon() {
  return (
    <Flex h="80px" w="80px" borderRadius="100px" align="center" justify="center" bg="success.background">
      <Flex h="60px" w="60px" borderRadius="100px" align="center" justify="center" bg="primary.900">
        <TermsIcon fontSize="18px" color="white" />
      </Flex>
    </Flex>
  )
}
