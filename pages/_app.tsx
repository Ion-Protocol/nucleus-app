import { Layout } from '@/components/layouts/Layout'
import { funkitConfig, funkitThemeConfig, isDebug } from '@/config/funkit'
import { queryClient } from '@/config/queryClient'
import { wagmiConfig } from '@/config/wagmi'
import { store } from '@/store'
import '@/styles/globals.css'
import theme from '@/styles/theme'
import { suppressErrors } from '@/utils/supressErrors'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { FunkitProvider } from '@funkit/connect'
import '@funkit/connect/styles.css'
import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { WagmiProvider } from 'wagmi'

suppressErrors()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FunkitProvider funkitConfig={funkitConfig} theme={funkitThemeConfig} debug={isDebug}>
          <ReduxProvider store={store}>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </ReduxProvider>
        </FunkitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
