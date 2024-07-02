import { ButtonStyles } from './ButtonStyles'
import { DividerStyles } from './DividerStyles'
import { TextStyles } from './TextStyles'

export const components = {
  Button: ButtonStyles,
  Divider: DividerStyles,
  Text: TextStyles,
  Tooltip: {
    baseStyle: {
      bg: 'tooltip.background',
      p: 2,
      borerRadius: 'md',
    },
  },
}
