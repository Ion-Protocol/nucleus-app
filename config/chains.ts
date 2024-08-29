import { Bridge } from '@/types/Bridge'
import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'
import { fraxtal, sei } from 'wagmi/chains'

export enum ChainKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
  FRAX = 'frax',
  SWELL = 'swell',
}

type Bridges = Partial<Record<BridgeKey, Bridge>>
export interface ChainConfig {
  id: number
  name: string
  bridges: Bridges
}

const mainnetBridges: Bridges = {
  [BridgeKey.SEI]: {
    name: 'Sei',
    chainId: sei.id,
    comingSoon: false,
    contracts: {
      teller: '0xB52C7d88F0514796877B04cF945E56cC4C66CD05',
      accountant: '0x24152894Decc7384b05E8907D6aDAdD82c176499',
      boringVault: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
    },
    sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
    sourceTokens: {
      [BridgeKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.WEETH, TokenKey.RSETH, TokenKey.RSWETH],
      [BridgeKey.SEI]: [TokenKey.WETH],
    },
    nativeToken: TokenKey.SEI,
    feeToken: TokenKey.ETH,
    networkSymbol: 'ETH',
    layerZeroChainSelector: 30280,
    description:
      'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
  },
  [BridgeKey.FRAX]: {
    name: 'Fraxtal',
    chainId: fraxtal.id,
    comingSoon: false,
    contracts: {
      teller: '0xD9395622c8Ec792D1cb6F39B562095fDa240BA57',
      accountant: '0x8F1f97624dDdd8a3949d5b91f94b127BCC5F1F84',
      boringVault: '0x647Ea8b492832e9D99A06DE8cc9A05e58FcCdF02',
    },
    sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.FRAX],
    sourceTokens: {
      [BridgeKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.WEETH, TokenKey.RSETH, TokenKey.RSWETH],
      [BridgeKey.FRAX]: [TokenKey.WFRXETH],
    },
    nativeToken: TokenKey.FRAX,
    feeToken: TokenKey.ETH, // The token here is technically just NATIVE, but for now we just use the name ETH here
    networkSymbol: 'ETH',
    layerZeroChainSelector: 30255,
    description:
      'The Frax Network is a decentralized stablecoin protocol that combines algorithmic and collateral-backed mechanisms to maintain price stability.',
  },
  [BridgeKey.SWELL]: {
    name: 'Swell',
    chainId: 1,
    comingSoon: false,
    contracts: {
      teller: '0x83EDE55dc738d4C2e65c4B55172Fbe3e14D83a4E',
      accountant: '0xf242ab602CbF29Cf9B5f4c3d90CA6EeF947ba6F1',
      boringVault: '0x215DC1cC32d9d08a0081e55E55895C8Cf006839a',
    },
    sourceBridges: [BridgeKey.ETHEREUM],
    sourceTokens: {
      [BridgeKey.ETHEREUM]: [TokenKey.WBTC, TokenKey.SWBTC],
    },
    nativeToken: TokenKey.RSWBTC,
    feeToken: TokenKey.ETH,
    networkSymbol: 'BTC',
    description: 'Swell is a liquid staking protocol for ETH, offering yield with flexible liquidity.',
  },
}

export const chainsConfig: Record<ChainKey, ChainConfig> = {
  [ChainKey.MAINNET]: {
    id: 1,
    name: 'Ethereum',
    bridges: mainnetBridges,
  },
  [ChainKey.TENDERLY_MAINNET]: {
    id: 99099127,
    name: 'Ion Testnet',
    bridges: mainnetBridges,
  },
  [ChainKey.SEI]: {
    id: sei.id,
    name: 'Sei',
    bridges: mainnetBridges,
  },
  [ChainKey.FRAX]: {
    id: fraxtal.id,
    name: 'Frax',
    bridges: mainnetBridges,
  },
  [ChainKey.SWELL]: {
    id: 1,
    name: 'Swell',
    bridges: mainnetBridges,
  },
}
