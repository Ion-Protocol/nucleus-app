import '@/styles/globals.css'
import theme from '@/styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config?.initialColorMode} />

      <Component {...pageProps} />
    </ChakraProvider>
  )
}
