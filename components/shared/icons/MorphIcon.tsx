import { Center } from '@chakra-ui/react'
import { MorphLogo } from './Morph'

export function MorphIcon() {
  return (
    <Center bg="neutral.50" h="28px" w="28px" border="2px solid" borderColor="border" borderRadius="50px">
      <MorphLogo />
    </Center>
  )
}
