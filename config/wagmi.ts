import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  bitgetWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { boba, Chain, fraxtal, mainnet, sei, sepolia } from 'wagmi/chains'
import { tenderlyStaging } from './tenderlyChain'

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet],
    },
    {
      groupName: 'Partner Wallets',
      wallets: [bitgetWallet],
    },
    {
      groupName: 'Hardware Wallets',
      wallets: [ledgerWallet],
    },
  ],
  {
    appName: 'Ion Protocol',
    projectId: WALLET_CONNECT_PROJECT_ID as string,
  }
)

const chains = [mainnet, sei, boba, fraxtal] as [Chain, ...Chain[]]

if (process.env.NEXT_PUBLIC_SHOW_TENDERLY) {
  chains.push(tenderlyStaging)
}
if (process.env.NEXT_PUBLIC_SHOW_SEPOLIA) {
  chains.push(sepolia)
}

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [tenderlyStaging.id]: http(),
    [sepolia.id]: http(),
    [sei.id]: http(),
    [boba.id]: http(),
    [fraxtal.id]: http(),
  },
  ssr: true,
})
