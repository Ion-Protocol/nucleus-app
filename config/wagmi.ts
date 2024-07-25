import { bitgetWallet, ledgerWallet } from '@funkit/connect/wallets'
import { http } from 'wagmi'
import { tenderlyStaging } from './tenderlyChain'
import { createFunkitWagmiConfig, getDefaultChains, getDefaultTransports, getDefaultWallets } from '@funkit/connect'

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const chains = getDefaultChains() as any

if (process.env.NEXT_PUBLIC_SHOW_TESTNET) {
  chains.push(tenderlyStaging)
}

const { wallets } = getDefaultWallets()

export const wagmiConfig = createFunkitWagmiConfig({
  appName: 'Ion Protocol',
  projectId: WALLET_CONNECT_PROJECT_ID as string,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [bitgetWallet, ledgerWallet],
    },
  ],
  chains,
  transports: { ...getDefaultTransports(), [tenderlyStaging.id]: http() },
  ssr: true,
})
