import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { createConfig, http } from 'wagmi'
import { Chain, mainnet } from 'wagmi/chains'
import {
  bitgetWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
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

const chains = [mainnet] as [Chain, ...Chain[]]

if (process.env.NEXT_PUBLIC_SHOW_TESTNET) {
  chains.push(tenderlyStaging)
}

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: { [mainnet.id]: http() },
})
