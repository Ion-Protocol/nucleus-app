import { fallback, http } from 'wagmi'
import { mainnet, type Chain } from 'wagmi/chains'
import { createFunkitWagmiConfig, getDefaultTransports, getDefaultWallets } from '@funkit/connect'
import { bitgetWallet, ledgerWallet } from '@funkit/connect/wallets'

import { sei, tenderlyStaging } from '@/config/tenderly'
import { SUPPORTED_CHAINS } from '@/config/constants'

const MAINNET_CHAINSTACK_URL = process.env.NEXT_PUBLIC_MAINNET_CHAINSTACK_URL || ''
const SEI_RPC_URL = process.env.NEXT_PUBLIC_SEI_RPC_URL || ''
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''
const TENDERLY_RPC_URL = process.env.NEXT_PUBLIC_TENDERLY_RPC_URL || ''

const supportedChains = SUPPORTED_CHAINS as [Chain, ...Chain[]]

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
  chains: supportedChains,
  transports: {
    ...getDefaultTransports(),
    [mainnet.id]: fallback([http(MAINNET_CHAINSTACK_URL)]),
    [tenderlyStaging.id]: http(TENDERLY_RPC_URL),
    [sei.id]: fallback([http(SEI_RPC_URL)]),
  },
  ssr: true,
})
