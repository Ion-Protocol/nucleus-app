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
          borderColor: 'stroke.main',
          paddingTop: '0',
          paddingBottom: '0',
          paddingX: 4,
          paddingY: 3,
        },
        tbody: {
          tr: {
            td: {
              borderTop: '1px solid',
              borderColor: 'stroke.lighter',
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
                // borderBottomColor: 'stroke.main',
                // borderColor: 'stroke.main',
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
  Checkbox: {
    variants: {
      nucleus: {
        control: {
          borderRadius: '1.333px',
          border: '0.667px solid',
          borderColor: 'checkbox.stroke',
          background: 'checkbox.bg',
          _checked: {
            bg: 'checkbox.bg-active',
            borderColor: 'checkbox.stroke-active',
            _dark: {
              bg: 'checkbox.bg-active',
              borderColor: 'checkbox.stroke-active',
            },
            _hover: {
              bg: 'checkbox.bg-active',
              borderColor: 'checkbox.stroke-active',
              _dark: {
                bg: 'checkbox.bg-active',
                borderColor: 'checkbox.stroke-active',
              },
            },
          },
          _hover: {
            borderColor: 'checkbox.stroke',
            _dark: {
              borderColor: 'checkbox.stroke',
            },
          },
          _focus: {
            boxShadow: 'none',
          },
        },
        icon: {
          color: 'checkbox.element-active',
        },
      },
    },
  },
}
