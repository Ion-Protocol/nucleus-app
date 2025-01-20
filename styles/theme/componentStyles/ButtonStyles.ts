import { ComponentStyleConfig, StyleFunctionProps } from '@chakra-ui/react'
import { getColorFromToken } from '../helpers/getColorFromToken'

const buttonGradient = (props: StyleFunctionProps) => {
  return `linear-gradient(101.87deg, ${props.theme.colors.primary[600]} 2.85%, ${props.theme.colors.primary[800]} 100.03%)`
}

const getSelectedSecondaryColor = (props: StyleFunctionProps) => {
  return getColorFromToken('shadow', props.colorMode)
}

export const ButtonStyles: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: '10px',
    paddingX: 6,
    paddingTop: '2px',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '2',
    marginTop: '3px',
  },
  variants: {
    solid: (props) => ({
      fontFamily: 'var(--font-ppformula)',
      color: 'textInverse',
      textStyle: 'button',
      background: 'primary',
      fontSize: '14px',
      fontWeight: 'normal',
      _hover: {
        background: 'primary',
        filter: 'brightness(0.8)',
      },
      _active: {
        background: 'primary',
        filter: 'brightness(0.6)',
      },
    }),
    outline: (props) => ({
      border: '1px solid',
      borderColor: 'stroke.main',
      backgroundColor: 'bg.main',
      fontWeight: 'normal',
    }),
    elevate: (props) => ({
      textStyle: 'button',
      border: 'none',
      backgroundColor: 'backgroundSecondary',
      boxShadow: `0px 4px 10px 0px ${getSelectedSecondaryColor(props)}`,
    }),
    borderless: (props) => ({
      backgroundColor: 'transparent',
      color: 'text',
      border: 'none',
      _hover: {
        background: 'hover',
      },
      _active: {
        background: 'active',
      },
    }),
  },
  defaultProps: {
    textStyle: 'button',
    variant: 'solid',
    size: 'md',
  },
}
