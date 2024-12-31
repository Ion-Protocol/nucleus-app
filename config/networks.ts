import { NetworkAssets } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { sei } from 'wagmi/chains'
import {
  defaultWithdrawalFee,
  etherscanBaseUrl,
  layerZeroBaseUrl,
  rariExplorerBaseUrl,
  seiExplorerBaseUrl,
} from './constants'
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

// TODO: Break into two types. Internal and External where mint and redeem take place in the Nucleus app or a partners app respectively
const mainnetNetworkAssets: NetworkAssets = {
  [TokenKey.SSETH]: {
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
    chain: ChainKey.SEI,
    contracts: {
      teller: '0x97D0B97A9FA017f8aD2565a5c6AED5745f3918b9',
      accountant: '0x6035832F65b0cf20064681505b73A6dE307a04cB',
      boringVault: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.SEI,
    deployedOn: ChainKey.SEI,
    description:
      'Connect your wallet, select your deposit asset, and mint the Sei Default Asset to earn while you explore the Sei ecosystem',
    layerZeroChainSelector: 30280,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.SSETH),
    nativeCurrency: tokensConfig[TokenKey.SEI],
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
    ],
    redeem: {
      layerZeroChainSelector: 30101,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.SSETH,
      redemptionSourceChain: ChainKey.SEI,
      redemptionSourceChains: {
        [ChainKey.SEI]: {
          chain: ChainKey.SEI,
          explorerBaseUrl: seiExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      wantTokens: {
        [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      withdrawalFee: defaultWithdrawalFee,
    },
    receiveOn: ChainKey.SEI,
    showRewardsAndHistory: true,
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
    sourceTokens: {
      [ChainKey.ETHEREUM]: [
        TokenKey.WETH,
        TokenKey.EZETH,
        TokenKey.WSTETH,
        TokenKey.APXETH,
        TokenKey.RSWETH,
        TokenKey.RSETH,
        TokenKey.WEETH,
        TokenKey.SFRXETH,
      ],
      [ChainKey.SEI]: [TokenKey.WETH, TokenKey.SEIYANETH],
    },
    token: tokensConfig[TokenKey.SSETH],
  },
  [TokenKey.FETH]: {
    apys: {},
    chain: ChainKey.FORM,
    contracts: {
      teller: '0xd567b6D8e9C95d8a29e60018156becaBDC63E851',
      accountant: '0x8ca1d13De3039142186aA57656Adbe0fD2620D2B',
      boringVault: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
    deployedOn: ChainKey.ETHEREUM,
    description:
      'Connect your wallet, select your deposit asset, and mint the Form ETH Default Yield Asset as you prepare to explore the Form Chain Ecosystem',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.FETH),
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
    redeem: {
      withdrawalFee: defaultWithdrawalFee,
      redemptionSourceChain: ChainKey.ETHEREUM,
      redemptionSourceChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.FETH,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      withdrawalChain: ChainKey.FORM,
      layerZeroChainSelector: 0,
      wantTokens: {
        [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.SFRXETH, TokenKey.APXETH],
      },
    },
    receiveOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.EZETH, TokenKey.PZETH],
    },
    token: tokensConfig[TokenKey.FETH],
  },
  [TokenKey.RARIETH]: {
    apys: {},
    chain: ChainKey.RARI,
    comingSoon: false,
    contracts: {
      teller: '0x5CcE6CB6B4b62C020f0CFCDB95FCdf6Ca706bE88',
      accountant: '0x3C2BE29D430686D00276A70acE51C6DC035ed6a1',
      boringVault: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
    },
    defaultMintChain: ChainKey.RARI,
    defaultRedemptionChain: ChainKey.RARI,
    deployedOn: ChainKey.RARI,
    description:
      'Connect your wallet, select your deposit asset, and mint the Rari Default Asset to earn while you explore the Rari ecosystem',
    isExternal: false,
    isNewDeployment: true,
    layerZeroChainSelector: 30235,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.RARIETH),
    nativeCurrency: tokensConfig[TokenKey.ETH],
    partnerUrl: 'https://app.rari.capital/earn/rarieth',
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
    ],
    redeem: {
      layerZeroChainSelector: 30101,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      redemptionSourceChain: ChainKey.RARI,
      redemptionSourceAsset: TokenKey.RARIETH,
      redemptionSourceChains: {
        [ChainKey.RARI]: {
          chain: ChainKey.RARI,
          explorerBaseUrl: rariExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      wantTokens: {
        [ChainKey.ETHEREUM]: [
          TokenKey.WETH,
          TokenKey.EZETH,
          TokenKey.WSTETH,
          TokenKey.APXETH,
          TokenKey.RSWETH,
          TokenKey.RSETH,
          TokenKey.WEETH,
        ],
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from shares token to want token
      withdrawalFee: defaultWithdrawalFee,
    },
    receiveOn: ChainKey.RARI,
    redeemComingSoon: true,
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
    sourceTokens: {
      [ChainKey.ETHEREUM]: [
        TokenKey.WETH,
        TokenKey.EZETH,
        TokenKey.WSTETH,
        TokenKey.APXETH,
        TokenKey.RSWETH,
        TokenKey.RSETH,
        TokenKey.WEETH,
      ],
      [ChainKey.RARI]: [TokenKey.WETH],
    },
    token: tokensConfig[TokenKey.RARIETH],
  },
  [TokenKey.UNIFIETH]: {
    apys: {},
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
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
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
    redeem: {
      withdrawalFee: defaultWithdrawalFee,
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
    apys: {},
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
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
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
    redeem: {
      withdrawalFee: defaultWithdrawalFee,
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
    apys: {},
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
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
    },
    contracts: {
      teller: '0x6Ae187EacF40ebd1e571a655dB92A1f47452E0Bf',
      accountant: '0x8c1902A5996978F2628558DD93d309F7e3926dfD',
      boringVault: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [],
    redeem: {
      withdrawalFee: defaultWithdrawalFee,
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
