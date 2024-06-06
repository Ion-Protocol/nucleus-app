import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  fonts: {
    heading: 'var(--font-aventa)',
    body: 'var(--font-aventa)',
    // Or directly use the font-family name if CSS variables are not used
    // heading: 'Aventa, sans-serif',
    // body: 'Aventa, sans-serif',
  },
})
