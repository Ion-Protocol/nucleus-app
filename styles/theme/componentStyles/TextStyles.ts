import { ComponentStyleConfig } from '@chakra-ui/react'
import { textStyles } from '../textStyles'
import { textStylesV2 } from '../textStyles-v2'

export const TextStyles: ComponentStyleConfig = {
  baseStyle: textStyles.baseStyle,
  variants: { ...textStyles, ...textStylesV2 },
}
