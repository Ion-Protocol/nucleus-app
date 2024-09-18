import { NetworkAssets } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { sei } from 'wagmi/chains'
import { tokensConfig } from './tokens'

export enum NetworkKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
}

export interface NetworkConfig {
  id: number
  name: string
  assets: NetworkAssets
}

const mainnetNetworkAssets: NetworkAssets = {
  [TokenKey.SSETH]: {
    token: tokensConfig[TokenKey.SSETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Sei Default Asset to earn while you explore the Sei ecosystem',
    chain: ChainKey.SEI,
    deployedOn: ChainKey.SEI,
    sourceChains: [ChainKey.ETHEREUM, ChainKey.SEI],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [
        TokenKey.WETH,
        TokenKey.EZETH,
        TokenKey.WSTETH,
        TokenKey.APXETH,
        TokenKey.PUFETH,
        TokenKey.RSWETH,
        TokenKey.RSETH,
        TokenKey.WEETH,
        TokenKey.SFRXETH,
      ],
      [ChainKey.SEI]: [
        TokenKey.WETH,
        TokenKey.SEIYANETH
      ],
    },
    contracts: {
      teller: '0x97D0B97A9FA017f8aD2565a5c6AED5745f3918b9',
      accountant: '0x6035832F65b0cf20064681505b73A6dE307a04cB',
      boringVault: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
    },
    layerZeroChainSelector: 30280,
    receiveOn: ChainKey.SEI,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
    ],
    apys: {
      [TokenKey.SEI]: [
        {
          tokenKey: TokenKey.SEI,
          startDate: 1726199999000, // 9/12/24 11:59:59pm EST
          endDate: 1734065999000, // 12/12/24 11:59:59pm EST
          distribution: 62_500, // $62,500
        },
      ],
      [TokenKey.DINERO]: [
        {
          tokenKey: TokenKey.DINERO,
          startDate: 1726199999000, // 9/12/24 11:59:59pm EST
          endDate: 1734065999000, // 12/12/24 11:59:59pm EST
          distribution: 62_500, // $62,500
        },
      ],
    },
  },
  [TokenKey.EARNBTC]: {
    token: tokensConfig[TokenKey.EARNBTC],
    comingSoon: true,
    description: '',
    chain: ChainKey.SWELL,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: [],
    sourceTokens: {},
    contracts: {
      teller: '0x',
      accountant: '0x',
      boringVault: '0x',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [],
    apys: {},
  },
  [TokenKey.TETH]: {
    token: tokensConfig[TokenKey.TETH],
    comingSoon: true,
    description: '',
    chain: ChainKey.ECLIPSE,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: [],
    sourceTokens: {},
    contracts: {
      teller: '0x',
      accountant: '0x',
      boringVault: '0x',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [],
    apys: {},
  },
}

export const networksConfig: Record<NetworkKey, NetworkConfig> = {
  [NetworkKey.MAINNET]: {
    id: 1,
    name: 'Ethereum',
    assets: mainnetNetworkAssets,
  },
  [NetworkKey.TENDERLY_MAINNET]: {
    id: 99099127,
    name: 'Ion Testnet',
    assets: mainnetNetworkAssets,
  },
  [NetworkKey.SEI]: {
    id: sei.id,
    name: 'Sei',
    assets: mainnetNetworkAssets,
  },
}
