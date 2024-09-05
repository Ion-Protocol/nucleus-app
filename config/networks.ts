import { Chain } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { fraxtal, sei } from 'wagmi/chains'

export enum NetworkKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
  FRAX = 'frax',
  SWELL = 'swell',
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
    description:
      'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
  },
  [ChainKey.FRAX]: {
    name: 'Fraxtal',
    chainId: fraxtal.id,
    comingSoon: false,
    contracts: {
      teller: '0xD9395622c8Ec792D1cb6F39B562095fDa240BA57',
      accountant: '0x8F1f97624dDdd8a3949d5b91f94b127BCC5F1F84',
      boringVault: '0x647Ea8b492832e9D99A06DE8cc9A05e58FcCdF02',
    },
    sourceChains: [ChainKey.ETHEREUM, ChainKey.FRAX],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.WEETH, TokenKey.RSETH, TokenKey.RSWETH],
      [ChainKey.FRAX]: [TokenKey.WFRXETH],
    },
    nativeToken: TokenKey.FRXTLETH,
    feeToken: TokenKey.ETH, // The token here is technically just NATIVE, but for now we just use the name ETH here
    networkSymbol: 'ETH',
    layerZeroChainSelector: 30255,
    receiveOn: ChainKey.FRAX,
    description:
      'The Frax Network is a decentralized stablecoin protocol that combines algorithmic and collateral-backed mechanisms to maintain price stability.',
  },
  [ChainKey.SWELL]: {
    name: 'Swell',
    chainId: 1,
    comingSoon: false,
    contracts: {
      teller: '0x83EDE55dc738d4C2e65c4B55172Fbe3e14D83a4E',
      accountant: '0xf242ab602CbF29Cf9B5f4c3d90CA6EeF947ba6F1',
      boringVault: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a',
    },
    sourceChains: [ChainKey.ETHEREUM],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WBTC, TokenKey.SWBTC],
    },
    nativeToken: TokenKey.RSWBTC,
    feeToken: TokenKey.ETH,
    receiveOn: ChainKey.ETHEREUM,
    networkSymbol: 'BTC',
    description: 'Swell is a liquid staking protocol for ETH, offering yield with flexible liquidity.',
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
  [NetworkKey.FRAX]: {
    id: fraxtal.id,
    name: 'Frax',
    chains: mainnetChains,
  },
  [NetworkKey.SWELL]: {
    id: 1,
    name: 'Swell',
    chains: mainnetChains,
  },
}
