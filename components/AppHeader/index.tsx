import { Button, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { IonConnectButton } from '../IonConnectButton.tsx'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import CurrencySelect from './CurrencySelect'

export function AppHeader() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex h="100px" borderBottom="1px solid" borderColor="border" justify="flex-end" align="center" pr={6} gap={3}>
      <IconButton
        variant="borderless"
        aria-label="toggle color mode"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
      <CurrencySelect />
      <IonConnectButton />
    </Flex>
  )
}
