import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { fonts } from './fonts'
import { colors } from './colors'
import semanticTokens from './tokens'
import { textStyles } from './textStyles'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts,
  colors,
  semanticTokens,
  textStyles,
  styles: {
    global: (props: any) => ({
      body: {
        bg: 'background',
        color: 'text',
      },
    }),
  },
})

export default theme
