import { extendTheme } from '@chakra-ui/react'
import { fonts } from '../fonts'
import { colors } from './colors'
import { components } from './componentStyles'
import { config } from './config'
import { styles } from './globalStyles'
import { textStyles } from './textStyles'
import { semanticTokens } from './tokens'

const theme = extendTheme({
  config,
  fonts,
  colors,
  semanticTokens,
  textStyles,
  components,
  styles,
})

export default theme
