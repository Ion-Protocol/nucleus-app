import { useColorMode } from '@chakra-ui/react'
import { useActiveTheme } from '@funkit/connect'
import { useEffect } from 'react'

export function useFunkitThemeInitializer() {
  const { colorMode } = useColorMode()
  const { lightMode, darkMode, setTheme } = useActiveTheme()

  // Set the funkit theme based on the initialized chakra ui mode
  useEffect(() => {
    setTheme(colorMode === 'light' ? (lightMode as any) : (darkMode as any))
  })
}
