import { extendTheme } from '@chakra-ui/react'
import { fonts } from '../fonts'
import { colors } from './colors'
import { components } from './componentStyles'
import { config } from './config'
import { styles } from './globalStyles'
import { textStyles } from './textStyles'
import { textStylesV2 } from './textStyles-v2'
import { semanticTokens } from './tokens'
import { colorsV2 } from './colors-v2'
import { semanticTokensV2 } from './tokens-v2'

const theme = extendTheme({
  config,
  fonts,
  colors: { ...colors, ...colorsV2 },
  semanticTokens: { colors: { ...semanticTokens.colors, ...semanticTokensV2.colors } },
  textStyles: { ...textStyles, ...textStylesV2 },
  components,
  styles,
})

export default theme
