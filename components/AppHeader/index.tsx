import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { useActiveTheme } from '@funkit/connect'
import { useCallback } from 'react'
import { IonConnectButton } from '../shared/IonConnectButton.tsx'

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
    <Flex h="4rem" bg="bg.white" justify="flex-end" align="center" pr={6} gap={3}>
      <IconButton
        variant="outline"
        aria-label="toggle color mode"
        onClick={handleToggleTheme}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
      <IonConnectButton />
    </Flex>
  )
}
