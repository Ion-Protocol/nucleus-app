import { Chain } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { sei } from 'wagmi/chains'

export enum NetworkKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
}

type Chains = Partial<Record<ChainKey, Chain>>
export interface NetworkConfig {
  id: number
  name: string
  chains: Chains
}

const mainnetChains: Chains = {
  [ChainKey.SEI]: {
    name: 'Sei',
    chainId: sei.id,
    comingSoon: false,
    contracts: {
      teller: '0xB52C7d88F0514796877B04cF945E56cC4C66CD05',
      accountant: '0x24152894Decc7384b05E8907D6aDAdD82c176499',
      boringVault: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
    },
    sourceChains: [ChainKey.ETHEREUM, ChainKey.SEI],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.WEETH, TokenKey.RSETH, TokenKey.RSWETH],
      [ChainKey.SEI]: [TokenKey.WETH],
    },
    nativeToken: TokenKey.SEIYANETH,
    feeToken: TokenKey.ETH,
    networkSymbol: 'ETH',
    layerZeroChainSelector: 30280,
    receiveOn: ChainKey.SEI,
    yieldAsset: TokenKey.SSETH,
    description:
      'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
  },
}

export const networksConfig: Record<NetworkKey, NetworkConfig> = {
  [NetworkKey.MAINNET]: {
    id: 1,
    name: 'Ethereum',
    chains: mainnetChains,
  },
  [NetworkKey.TENDERLY_MAINNET]: {
    id: 99099127,
    name: 'Ion Testnet',
    chains: mainnetChains,
  },
  [NetworkKey.SEI]: {
    id: sei.id,
    name: 'Sei',
    chains: mainnetChains,
  },
}
