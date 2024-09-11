import { createFunkitWagmiConfig, getDefaultTransports, getDefaultWallets } from '@funkit/connect'
import { bitgetWallet, ledgerWallet } from '@funkit/connect/wallets'
import { fallback, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { sei, tenderlyStaging } from './tenderly'

const MAINNET_CHAINSTACK_URL = process.env.NEXT_PUBLIC_MAINNET_CHAINSTACK_URL || ''
const SEI_RPC_URL = process.env.NEXT_PUBLIC_SEI_RPC_URL || ''

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const chains = [] as any

chains.push(mainnet)
if (process.env.NEXT_PUBLIC_SHOW_TENDERLY) {
  chains.push(tenderlyStaging)
}
chains.push(sei)

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
    [mainnet.id]: fallback([http(MAINNET_CHAINSTACK_URL)]),
    [tenderlyStaging.id]: http(),
    [sei.id]: fallback([http(SEI_RPC_URL)]),
  },
  ssr: true,
})
