import { Layout } from '@/components/layouts/Layout'
import { queryClient } from '@/config/queryClient'
import { wagmiConfig } from '@/config/wagmi'
import { store } from '@/store'
import '@/styles/globals.css'
import theme from '@/styles/theme'
import { suppressErrors } from '@/utils/supressErrors'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import '@funkit/connect/styles.css'
import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { WagmiProvider } from 'wagmi'
import { FunkitProvider, lightTheme } from '@funkit/connect'
import { funkitConfig } from '@/config/funkit'

suppressErrors()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FunkitProvider
          funkitConfig={funkitConfig}
          theme={lightTheme({
            accentColor: 'linear-gradient(101.87deg, #01B0D1 2.85%, #00869d 100.03%)',
            borderRadius: 'small',
            customColors: {
              notificationPrimary: 'var(--chakra-colors-primary-50)',
            },
          })}
          debug={true}
        >
          <Provider store={store}>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </Provider>
        </FunkitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
