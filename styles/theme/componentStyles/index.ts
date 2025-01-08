import { ButtonStyles } from './ButtonStyles'
import { DividerStyles } from './DividerStyles'
import { TextStyles } from './TextStyles'

export const components = {
  Button: ButtonStyles,
  Divider: DividerStyles,
  Text: TextStyles,
  Table: {
    // TODO: move to Table.ts and account for dark mode
    variants: {
      nucleus: {
        table: {
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontFamily: 'diatype',
        },
        th: {
          color: 'element.subdued',
          fontWeight: 'normal',
          textTransform: 'none',
          fontSize: 'sm',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'neutral.600',
          paddingTop: '0',
          paddingBottom: '0',
          paddingX: 4,
          paddingY: 3,
        },
        tbody: {
          tr: {
            td: {
              borderTop: '1px solid',
              borderColor: 'neutral.400',
              height: '5rem',
              bg: 'bg.white',
            },
            '&:hover': {
              td: {
                bg: 'bg.main',
              },
            },
            '&:first-of-type': {
              td: {
                borderTop: 'none',
              },
            },
            '&:last-of-type': {
              td: {
                borderBottom: '1px solid',
                borderColor: 'neutral.400',
              },
            },
          },
        },
        td: {
          fontSize: 'normal',
          fontWeight: 'normal',
          textAlign: 'center',
          bg: 'white',
          maxHeight: '5rem',
          minHeight: '5rem',
          p: 2,
        },
      },
    },
  },
}
