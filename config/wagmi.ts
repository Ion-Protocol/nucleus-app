import { createFunkitWagmiConfig, getDefaultChains, getDefaultTransports, getDefaultWallets } from '@funkit/connect'
import { bitgetWallet, ledgerWallet } from '@funkit/connect/wallets'
import { http } from 'wagmi'
import { boba, fraxtal, sei } from 'wagmi/chains'
import { tenderlyStaging } from './tenderlyChain'

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const chains = getDefaultChains() as any

if (process.env.NEXT_PUBLIC_SHOW_TENDERLY) {
  chains.push(tenderlyStaging)
}

chains.push(sei)
chains.push(boba)
chains.push(fraxtal)

const { wallets } = getDefaultWallets()

export const wagmiConfig = createFunkitWagmiConfig({
  appName: 'Nucleus',
  projectId: WALLET_CONNECT_PROJECT_ID as string,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [bitgetWallet, ledgerWallet],
    },
  ],
  chains,
  transports: {
    ...getDefaultTransports(),
    [tenderlyStaging.id]: http(),
    [sei.id]: http(),
    [boba.id]: http(),
    [fraxtal.id]: http(),
  },
  ssr: true,
})
