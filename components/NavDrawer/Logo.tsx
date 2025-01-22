import { Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { NucleusLogoIcon } from '../shared/icons/NucleusLogoBlack'

export function Logo() {
  const router = useRouter()

  function handleClick() {
    router.push('/dashboard')
  }

  return (
    <Flex height="4rem" p="1.25rem" gap={2} onClick={handleClick} cursor="pointer" alignItems="center">
      <NucleusLogoIcon fontSize="24px" />
      <Text variant="heading1" fontSize={'24px'}>
        Nucleus
      </Text>
    </Flex>
  )
}
