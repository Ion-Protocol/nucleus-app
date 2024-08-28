import { createFunkitWagmiConfig, getDefaultTransports, getDefaultWallets } from '@funkit/connect'
import { bitgetWallet, ledgerWallet } from '@funkit/connect/wallets'
import { http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { fraxtal, sei, tenderlyStaging } from './networks'

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const chains = [] as any

chains.push(mainnet)
if (process.env.NEXT_PUBLIC_SHOW_TENDERLY) {
  chains.push(tenderlyStaging)
}
chains.push(sei)
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
    [fraxtal.id]: http(),
  },
  ssr: true,
})
