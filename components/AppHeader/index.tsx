import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { useActiveTheme } from '@funkit/connect'
import { useCallback } from 'react'
import { IonConnectButton } from '../shared/IonConnectButton.tsx'
import CurrencySelect from './CurrencySelect'

export function AppHeader() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { toggleTheme } = useActiveTheme()

  const handleToggleTheme = useCallback(() => {
    // Toggle funkit widget theme
    toggleTheme()
    // Toggle chakra-ui color mode
    toggleColorMode()
  }, [toggleColorMode, toggleTheme])

  return (
    <Flex h="100px" borderBottom="1px solid" borderColor="border" justify="flex-end" align="center" pr={6} gap={3}>
      <IconButton
        variant="borderless"
        aria-label="toggle color mode"
        onClick={handleToggleTheme}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
      <CurrencySelect />
      <IonConnectButton />
    </Flex>
  )
}
