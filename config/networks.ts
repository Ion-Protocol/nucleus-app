import { NetworkAssets } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { sei } from 'wagmi/chains'
import { etherscanBaseUrl, layerZeroBaseUrl, rariExplorerBaseUrl, seiExplorerBaseUrl } from './constants'
import { rari } from './tenderly'
import { tokensConfig } from './tokens'

const MANUALLY_PAUSED_NETWORK_ASSETS = process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',') || []

export enum NetworkKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
  RARI = 'rari',
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
    defaultMintChain: ChainKey.ETHEREUM,
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
    redeem: {
      redemptionSourceChain: ChainKey.SEI,
      redemptionSourceChains: {
        [ChainKey.SEI]: {
          chain: ChainKey.SEI,
          explorerBaseUrl: seiExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.SSETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      layerZeroChainSelector: 30101,
      wantTokens: {
        [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
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
    defaultMintChain: ChainKey.ETHEREUM,
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
    redeem: {
      redemptionSourceChain: ChainKey.ETHEREUM,
      redemptionSourceChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.FETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.FORM,
      layerZeroChainSelector: 0,
      wantTokens: {
        [ChainKey.FORM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
  },
  [TokenKey.RARIETH]: {
    token: tokensConfig[TokenKey.RARIETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Rari Default Asset to earn while you explore the Rari ecosystem',
    chain: ChainKey.RARI,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.RARIETH),
    comingSoon: false,
    redeemComingSoon: true,
    isExternal: false,
    isNewDeployment: true,
    partnerUrl: 'https://app.rari.capital/earn/rarieth',
    deployedOn: ChainKey.RARI,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
      [ChainKey.RARI]: {
        chain: ChainKey.RARI,
        explorerBaseUrl: rariExplorerBaseUrl,
      },
    },
    defaultMintChain: ChainKey.RARI,
    defaultRedemptionChain: ChainKey.RARI,
    sourceRedemptionChains: {
      [ChainKey.RARI]: {
        chain: ChainKey.RARI,
        explorerBaseUrl: rariExplorerBaseUrl,
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
      [ChainKey.RARI]: [TokenKey.WETH],
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
    },
    contracts: {
      teller: '0x5CcE6CB6B4b62C020f0CFCDB95FCdf6Ca706bE88',
      accountant: '0x3C2BE29D430686D00276A70acE51C6DC035ed6a1',
      boringVault: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
    },
    layerZeroChainSelector: 30235,
    receiveOn: ChainKey.RARI,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
    ],
    apys: {},
    redeem: {
      redemptionSourceChain: ChainKey.RARI,
      redemptionSourceChains: {
        [ChainKey.RARI]: {
          chain: ChainKey.RARI,
          explorerBaseUrl: rariExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.RARIETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      layerZeroChainSelector: 30235,
      wantTokens: {
        [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
  },
  [TokenKey.UNIFIETH]: {
    token: tokensConfig[TokenKey.UNIFIETH],
    description: '',
    comingSoon: false,
    isExternal: true,
    isNewDeployment: true,
    partnerUrl: 'https://quest.puffer.fi/unifi#stake-and-earn',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.UNIFIETH),
    chain: ChainKey.UNIFI,
    layerZeroChainSelector: 111111, // Not actual
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
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
    },
    wantTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
    },
    contracts: {
      teller: '0x08eb2eccdf6ebd7aba601791f23ec5b5f68a1d53',
      accountant: '0xa9fb7e2922216debe3fd5e1bbe7591ee446dc21c',
      boringVault: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
    ],
    apys: {},
    redeem: {
      redemptionSourceChain: ChainKey.UNIFI,
      redemptionSourceChains: {
        [ChainKey.UNIFI]: {
          chain: ChainKey.UNIFI,
          explorerBaseUrl: rariExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.UNIFIETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      layerZeroChainSelector: 111111, // placeholder
      wantTokens: {
        [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
  },
  [TokenKey.EARNETH]: {
    token: tokensConfig[TokenKey.EARNETH],
    description:
      'Connect your wallet, select your deposit asset, and mint the Swell ETH Default Yield Asset as you prepare to explore the Swell Chain Ecosystem',
    comingSoon: false,
    isExternal: true,
    partnerUrl: 'https://app.swellnetwork.io/earn/earneth',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.EARNETH),
    chain: ChainKey.SWELL,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultMintChain: ChainKey.ETHEREUM,
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
    redeem: {
      redemptionSourceChain: ChainKey.ETHEREUM,
      redemptionSourceChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.EARNETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.SWELL,
      layerZeroChainSelector: 0,
      wantTokens: {
        [ChainKey.SWELL]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
  },
  [TokenKey.TETH]: {
    token: tokensConfig[TokenKey.TETH],
    description: '',
    comingSoon: false,
    isExternal: true,
    partnerUrl: 'https://app.eclipse.xyz/mint-teth',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.TETH),
    chain: ChainKey.ECLIPSE,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    defaultMintChain: ChainKey.ETHEREUM,
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
      teller: '0x6Ae187EacF40ebd1e571a655dB92A1f47452E0Bf',
      accountant: '0x8c1902A5996978F2628558DD93d309F7e3926dfD',
      boringVault: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [],
    apys: {},
    redeem: {
      redemptionSourceChain: ChainKey.ETHEREUM,
      redemptionSourceChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.TETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.ECLIPSE,
      layerZeroChainSelector: 30101,
      wantTokens: {
        [ChainKey.ECLIPSE]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
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
  [NetworkKey.RARI]: {
    id: rari.id,
    name: 'Rari',
    assets: mainnetNetworkAssets,
  },
}
