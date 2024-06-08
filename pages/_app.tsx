import '@/styles/globals.css'
import theme from '@/styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config?.initialColorMode} />

        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}
