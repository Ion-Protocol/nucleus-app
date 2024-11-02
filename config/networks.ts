import { NetworkAssets } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { sei } from 'wagmi/chains'
import { tokensConfig } from './tokens'
import { etherscanBaseUrl, layerZeroBaseUrl, seiExplorerBaseUrl } from './constants'

const MANUALLY_PAUSED_NETWORK_ASSETS = process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',') || []

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

const defaultEthVaultAssets = [
  TokenKey.WETH,
  TokenKey.EZETH,
  TokenKey.WSTETH,
  TokenKey.APXETH,
  TokenKey.PUFETH,
  TokenKey.RSWETH,
  TokenKey.RSETH,
  TokenKey.WEETH,
  TokenKey.SFRXETH,
  TokenKey.PZETH,
]

const mainnetNetworkAssets: NetworkAssets = {
  [TokenKey.SSETH]: {
    token: tokensConfig[TokenKey.SSETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Sei Default Asset to earn while you explore the Sei ecosystem',
    chain: ChainKey.SEI,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.SSETH),
    showRewardsAndHistory: true,
    deployedOn: ChainKey.SEI,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
      [ChainKey.SEI]: {
        chain: ChainKey.SEI,
        explorerBaseUrl: seiExplorerBaseUrl,
      },
    },
    defaultRedemptionChain: ChainKey.SEI,
    sourceRedemptionChains: {
      [ChainKey.SEI]: {
        chain: ChainKey.SEI,
        explorerBaseUrl: seiExplorerBaseUrl,
      },
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    redemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
      [ChainKey.SEI]: [TokenKey.WETH, TokenKey.SEIYANETH],
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
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
      [TokenKey.ISEI]: [
        {
          tokenKey: TokenKey.ISEI,
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
  [TokenKey.FETH]: {
    token: tokensConfig[TokenKey.FETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Form ETH Default Yield Asset as you prepare to explore the Form Chain Ecosystem',
    chain: ChainKey.FORM,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.FETH),
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultRedemptionChain: ChainKey.ETHEREUM,
    sourceRedemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    redemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.EZETH, TokenKey.PZETH],
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
    },
    contracts: {
      teller: '0xd567b6D8e9C95d8a29e60018156becaBDC63E851',
      accountant: '0x8ca1d13De3039142186aA57656Adbe0fD2620D2B',
      boringVault: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.FORM,
        name: 'Form Points',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus Points',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.RENZO,
        name: 'ezPoints',
        pointsMultiplier: 2,
      },
      {
        key: PointSystemKey.SYMBIOTIC,
        name: 'Symbiotic Points',
        pointsMultiplier: 0.5,
      },
      {
        key: PointSystemKey.MELLOW,
        name: 'Mellow Points',
        pointsMultiplier: 1,
      },
    ],
    apys: {},
  },
  [TokenKey.EARNETH]: {
    token: tokensConfig[TokenKey.EARNETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Swell ETH Default Yield Asset as you prepare to explore the Swell Chain Ecosystem',
    comingSoon: true,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.EARNETH),
    chain: ChainKey.SWELL,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultRedemptionChain: ChainKey.ETHEREUM,
    sourceRedemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    redemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
    },
    contracts: {
      teller: '0x685aDb4797fb38D4Fc4a69750aa048B398160429',
      accountant: '0x411c78BC8c36c3c66784514f28c56209e1DF2755',
      boringVault: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.SWELL,
        name: 'Swell',
        pointsMultiplier: 3,
      },
    ],
    apys: {},
  },
  [TokenKey.TETH]: {
    token: tokensConfig[TokenKey.TETH],
    description: '',
    comingSoon: true,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.TETH),
    chain: ChainKey.ECLIPSE,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultRedemptionChain: ChainKey.ETHEREUM,
    sourceRedemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    redemptionChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: layerZeroBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
    },
    contracts: {
      teller: '0x0',
      accountant: '0x0',
      boringVault: '0x0',
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
    id: 1330,
    name: 'Sei Staging',
    assets: mainnetNetworkAssets,
  },
  [NetworkKey.SEI]: {
    id: sei.id,
    name: 'Sei',
    assets: mainnetNetworkAssets,
  },
}
