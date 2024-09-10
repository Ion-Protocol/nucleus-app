import { Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { NucleusLogoIcon } from '../shared/icons/NucleusLogoBlack'

export function Logo() {
  const router = useRouter()

  function handleClick() {
    router.push('/dashboard')
  }

  return (
    <Flex alignItems="center" gap={3} onClick={handleClick} cursor="pointer">
      <NucleusLogoIcon fontSize="28px" />
      <Text variant="heading2" mt="6px">
        Nucleus
      </Text>
    </Flex>
  )
}
