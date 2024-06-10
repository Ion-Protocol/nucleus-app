import { ComponentStyleConfig, StyleFunctionProps } from '@chakra-ui/react'

const buttonGradient = (props: StyleFunctionProps) => {
  return `linear-gradient(101.87deg, ${props.theme.colors.primary[600]} 2.85%, ${props.theme.colors.primary[800]} 100.03%)`
}

export const ButtonStyles: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: '5px',
    paddingX: 6,
    paddingY: 3,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '2',
    marginTop: '3px',
  },
  variants: {
    solid: (props) => ({
      color: 'white',
      background: buttonGradient(props),
      _hover: {
        background: buttonGradient(props),
        filter: 'brightness(0.9)',
        _active: {
          background: buttonGradient(props),
          filter: 'brightness(0.7)',
        },
      },
    }),
    outline: (props) => ({
      border: '2px solid',
      borderColor: 'border',
      backgroundColor: 'backgroundSecondary',
    }),
  },
  defaultProps: {
    textStyle: 'button',
    variant: 'solid',
    size: 'md',
  },
}
