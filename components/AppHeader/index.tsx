import { Button, Flex, Text, useColorMode } from '@chakra-ui/react'

export function AppHeader() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex bg="red.dark" h="80px">
      <Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button>
      <Text>App Header</Text>
    </Flex>
  )
}
