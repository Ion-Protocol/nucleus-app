import { ButtonStyles } from './ButtonStyles'
import { DividerStyles } from './DividerStyles'
import { TextStyles } from './TextStyles'

export const components = {
  Button: ButtonStyles,
  Divider: DividerStyles,
  Text: TextStyles,
  Table: {
    variants: {
      nucleus: {
        table: {
          borderCollapse: 'separate',
          borderSpacing: '0',
          bg: 'white',
        },
        th: {
          color: 'neutral.800',
          fontWeight: 'normal',
          textTransform: 'none',
          fontSize: 'sm',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'neutral.600',
        },
        tbody: {
          tr: {
            td: {
              borderTop: '1px solid',
              borderColor: 'neutral.400',
              height: '5rem',
            },
            '&:hover': {
              bg: 'neutral.500',
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
          lineHeight: '20px',
          textAlign: 'center',
          bg: 'white',
        },
      },
    },
  },
}
