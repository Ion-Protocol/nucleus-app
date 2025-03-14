import { NetworkAssets } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { boba, sei } from 'wagmi/chains'
import {
  bobaExplorerBaseURL,
  defaultWithdrawalFee,
  etherscanBaseUrl,
  formExplorerBaseUrl,
  hyperlaneBaseUrl,
  layerZeroBaseUrl,
  rariExplorerBaseUrl,
  seiExplorerBaseUrl,
  swellExplorerBaseURL,
} from './constants'
import { form, rari } from './customWagmiChains'
import { tokensConfig } from './tokens'

const MANUALLY_PAUSED_NETWORK_ASSETS = process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',') || []

export enum NetworkKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEI = 'sei',
  RARI = 'rari',
  BOBA = 'boba',
  FORM = 'form',
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
  [TokenKey.BOBAETH]: {
    apys: {},
    chain: ChainKey.BOBA,
    comingSoon: false,
    contracts: {
      teller: '0xCd721cd24811013c35fFd4BaeF63F07A600EA8bA',
      accountant: '0x78cba912751dB70CBd77C1111A4d1aDD077AD99A',
      boringVault: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
    deployedOn: ChainKey.BOBA,
    description:
      'Connect your wallet, select your deposit asset, and mint the Boba Default Asset to earn while you explore the Boba ecosystem',
    hyperlaneChainSelector: 288, // Hyperlane Domain Identifier
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.BOBAETH),
    nativeCurrency: tokensConfig[TokenKey.ETH],
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 1,
      },
    ],
    redeemComingSoon: false,
    redeem: {
      hyperlaneChainSelector: 1, // Hyperlane Domain Identifier
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.BOBAETH,
      redemptionSourceChain: ChainKey.BOBA,
      redemptionSourceChains: {
        [ChainKey.BOBA]: {
          chain: ChainKey.BOBA,
          explorerBaseUrl: bobaExplorerBaseURL,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      wantTokens: {
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee,
          },
          [TokenKey.RSWETH]: {
            token: tokensConfig[TokenKey.RSWETH],
            withdrawalFee: defaultWithdrawalFee,
          },
          [TokenKey.EZETH]: {
            token: tokensConfig[TokenKey.EZETH],
            withdrawalFee: defaultWithdrawalFee,
          },
          [TokenKey.WEETH]: {
            token: tokensConfig[TokenKey.WEETH],
            withdrawalFee: defaultWithdrawalFee,
          },
          [TokenKey.WSTETH]: {
            token: tokensConfig[TokenKey.WSTETH],
            withdrawalFee: defaultWithdrawalFee,
          },
        },
        [ChainKey.BOBA]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: 0.01,
          },
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      withdrawalFee: defaultWithdrawalFee,
    },
    receiveOn: ChainKey.BOBA,
    showRewardsAndHistory: false,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: hyperlaneBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: [
        TokenKey.WETH,
        TokenKey.APXETH,
        TokenKey.RSWETH,
        TokenKey.EZETH,
        TokenKey.WEETH,
        TokenKey.WSTETH,
      ],
    },
    token: tokensConfig[TokenKey.BOBAETH],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.BOBA]: {
        chain: ChainKey.BOBA,
      },
    },
    protocols: [ChainKey.OKU, ChainKey.TEAHOUSE, ChainKey.LENDLAND, ChainKey.LYNX],
  },
  [TokenKey.SSETH]: {
    apys: {},
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
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.SFRXETH]: {
            token: tokensConfig[TokenKey.SFRXETH],
            withdrawalFee: 0.01, // Custom fee for SFRXETH
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: 0.01, // Custom fee for APXETH
          },
        },
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
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.SEI]: {
        chain: ChainKey.SEI,
      },
    },
    protocols: [ChainKey.JELLYVERSE],
  },
  [TokenKey.FETH]: {
    apys: {},
    allowBridge: true,
    bridge: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
        bridgeChainIdentifier: 1,
        bridgeExplorerBaseUrl: hyperlaneBaseUrl,
      },
      [ChainKey.FORM]: {
        chain: ChainKey.FORM,
        explorerBaseUrl: formExplorerBaseUrl,
        bridgeChainIdentifier: 478,
        bridgeExplorerBaseUrl: hyperlaneBaseUrl,
      },
    },
    chain: ChainKey.FORM,
    comingSoon: false,
    contracts: {
      teller: '0x1360c5FEDe23B28196d7744DCFA35C63b7fF4322',
      accountant: '0x8ca1d13De3039142186aA57656Adbe0fD2620D2B',
      boringVault: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
    deployedOn: ChainKey.FORM,
    description:
      'Connect your wallet, select your deposit asset, and mint the Boba Default Asset to earn while you explore the Boba ecosystem',
    hyperlaneChainSelector: 478, // Hyperlane Domain Identifier
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.BOBAETH),
    nativeCurrency: tokensConfig[TokenKey.ETH],
    points: [
      {
        key: PointSystemKey.FORM,
        name: 'Form',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.RENZO,
        name: 'ezPoints',
        pointsMultiplier: 2,
      },
      {
        key: PointSystemKey.SYMBIOTIC,
        name: 'Symbiotic',
        pointsMultiplier: 0.5,
      },
      {
        key: PointSystemKey.MELLOW,
        name: 'Mellow',
        pointsMultiplier: 1,
      },
    ],
    redeemComingSoon: false,
    redeem: {
      hyperlaneChainSelector: 1, // Hyperlane Domain Identifier
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
        [ChainKey.FORM]: {
          chain: ChainKey.FORM,
          explorerBaseUrl: formExplorerBaseUrl,
        },
      },
      redemptionSourceAsset: TokenKey.FETH,
      redemptionSourceChain: ChainKey.FORM,
      redemptionSourceChains: {
        [ChainKey.FORM]: {
          chain: ChainKey.FORM,
          explorerBaseUrl: formExplorerBaseUrl,
        },
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: etherscanBaseUrl,
        },
      },
      wantTokens: {
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.WSTETH]: {
            token: tokensConfig[TokenKey.WSTETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.PZETH]: {
            token: tokensConfig[TokenKey.PZETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.EZETH]: {
            token: tokensConfig[TokenKey.EZETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
        [ChainKey.FORM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: 0.02,
          },
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from SSETH to Want Token
      withdrawalFee: defaultWithdrawalFee,
    },
    receiveOn: ChainKey.FORM,
    showRewardsAndHistory: false,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: hyperlaneBaseUrl,
      },
      [ChainKey.FORM]: {
        chain: ChainKey.FORM,
        explorerBaseUrl: formExplorerBaseUrl,
      },
    },
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.EZETH, TokenKey.PZETH],
      [ChainKey.FORM]: [TokenKey.WETH],
    },
    token: tokensConfig[TokenKey.FETH],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.FORM]: {
        chain: ChainKey.FORM,
      },
    },
    protocols: [],
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
        pointsMultiplier: 1,
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
        [ChainKey.RARI]: {
          chain: ChainKey.RARI,
          explorerBaseUrl: rariExplorerBaseUrl,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.EZETH]: {
            token: tokensConfig[TokenKey.EZETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.WSTETH]: {
            token: tokensConfig[TokenKey.WSTETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.RSWETH]: {
            token: tokensConfig[TokenKey.RSWETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.RSETH]: {
            token: tokensConfig[TokenKey.RSETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.WEETH]: {
            token: tokensConfig[TokenKey.WEETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
        [ChainKey.RARI]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: 0, // Default 0.2%,
          },
        },
      },
      withdrawalChain: ChainKey.ETHEREUM, // Call to teller to withdraw from shares token to want token
      withdrawalFee: defaultWithdrawalFee,
    },
    receiveOn: ChainKey.RARI,
    redeemComingSoon: false,
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
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.RARI]: {
        chain: ChainKey.RARI,
      },
    },
    protocols: [],
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
      {
        key: PointSystemKey.CARROTS,
        name: 'Carrots',
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.SFRXETH]: {
            token: tokensConfig[TokenKey.SFRXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
    },
  },
  [TokenKey.UNIFIBTC]: {
    apys: {},
    token: tokensConfig[TokenKey.UNIFIBTC],
    description: '',
    comingSoon: false,
    isExternal: true,
    isNewDeployment: true,
    partnerUrl: 'https://app.puffer.fi/vaults/unifiBTC',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.UNIFIBTC),
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
      teller: '0x0743647a607822781f9d0a639454e76289182f0b',
      accountant: '0x2afb28b0561d99b5e00829ec2ef54946a00a35f7',
      boringVault: '0x170d847a8320f3b6a77ee15b0cae430e3ec933a0',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
      {
        key: PointSystemKey.CARROTS,
        name: 'Carrots',
        pointsMultiplier: 1,
      },
    ],
    redeem: {
      withdrawSlippage: defaultWithdrawSlippage,
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
      redemptionSourceAsset: TokenKey.UNIFIBTC,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawSlippage: defaultWithdrawSlippage, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
    },
  },
  [TokenKey.UNIFIUSD]: {
    apys: {},
    token: tokensConfig[TokenKey.UNIFIUSD],
    description: '',
    comingSoon: false,
    isExternal: true,
    isNewDeployment: true,
    partnerUrl: 'https://app.puffer.fi/vaults/unifiUSD',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.UNIFIUSD),
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
      teller: '0x5d3Fb47FE7f3F4Ce8fe55518f7E4F7D6061B54DD',
      accountant: '0xe0bDb7b9225A2CeB42998dc2E51D4D3CDeb7e3Be',
      boringVault: '0x82c40e07277eBb92935f79cE92268F80dDc7caB4',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 2,
      },
      {
        key: PointSystemKey.CARROTS,
        name: 'Carrots',
        pointsMultiplier: 1,
      },
    ],
    redeem: {
      withdrawSlippage: defaultWithdrawSlippage,
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
      redemptionSourceAsset: TokenKey.UNIFIUSD,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawSlippage: defaultWithdrawSlippage, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
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
      [ChainKey.SWELL]: {
        chain: ChainKey.SWELL,
        explorerBaseUrl: swellExplorerBaseURL,
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
        key: PointSystemKey.WSWELL,
        name: 'wSWELL',
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.SFRXETH]: {
            token: tokensConfig[TokenKey.SFRXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.SWELL]: {
        chain: ChainKey.SWELL,
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
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.GRASS,
        name: 'Grass',
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.SFRXETH]: {
            token: tokensConfig[TokenKey.SFRXETH],
            withdrawalFee: defaultWithdrawalFee, /// Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [
      ChainKey.ORCA,
      ChainKey.INVARIANT,
      ChainKey.SAVE,
      ChainKey.ASTROL,
      ChainKey.SANDGLASS,
      ChainKey.NEPTUNE,
    ],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
    },
  },
  [TokenKey.EARNBTC]: {
    apys: {},
    token: tokensConfig[TokenKey.EARNBTC],
    description:
      'Connect your wallet, select your deposit asset, and mint the Swell ETH Default Yield Asset as you prepare to explore the Swell Chain Ecosystem',
    comingSoon: false,
    isExternal: true,
    partnerUrl: 'https://app.swellnetwork.io/earn/earnbtc',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.EARNBTC),
    chain: ChainKey.SWELL,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
      [ChainKey.SWELL]: {
        chain: ChainKey.SWELL,
        explorerBaseUrl: swellExplorerBaseURL,
      },
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
    },
    contracts: {
      teller: '0x651F908702F23D794dC54FA36D77DFB6E35F0924',
      accountant: '0x6bBf58f1A95D22f497fD2e7f640fAE94481b1A08',
      boringVault: '0x66E47E6957B85Cf62564610B76dD206BB04d831a',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 3,
      },
      {
        key: PointSystemKey.PUMPBTC,
        name: 'Pump BTC',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.LORENZOSTBTC,
        name: 'Lorenzo stBTC',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.FIREBTC,
        name: 'Fire Bitcoin',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.BABYLON,
        name: 'Babylon',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.SOLVBTC,
        name: 'Solv BTC',
        pointsMultiplier: 1,
      },
      {
        key: PointSystemKey.WSWELL,
        name: 'wSWELL',
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.SFRXETH]: {
            token: tokensConfig[TokenKey.SFRXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
          [TokenKey.APXETH]: {
            token: tokensConfig[TokenKey.APXETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.SWELL]: {
        chain: ChainKey.SWELL,
      },
    },
  },
  [TokenKey.NELIXIR]: {
    apys: {},
    token: tokensConfig[TokenKey.NELIXIR],
    description:
      'Connect your wallet, select your deposit asset, and mint the Swell ETH Default Yield Asset as you prepare to explore the Swell Chain Ecosystem',
    comingSoon: false,
    isExternal: true,
    partnerUrl: 'https://app.nest.credit/nest-elixir-vault',
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.NELIXIR),
    chain: ChainKey.PLUME,
    deployedOn: ChainKey.ETHEREUM,
    sourceChains: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
        explorerBaseUrl: etherscanBaseUrl,
      },
      [ChainKey.PLUME]: {
        chain: ChainKey.PLUME,
        explorerBaseUrl: swellExplorerBaseURL,
      },
    },
    defaultMintChain: ChainKey.ETHEREUM,
    defaultRedemptionChain: ChainKey.ETHEREUM,
    sourceTokens: {
      [ChainKey.ETHEREUM]: defaultEthVaultAssets,
    },
    contracts: {
      teller: '0xd65d39c859c6754b3bc14f5c03c4a1ae80fc4c15',
      accountant: '0xadb076707abed7d19e3a75d98e77fcdfa4c15d93',
      boringVault: '0x9fbc367b9bb966a2a537989817a088afcaffdc4c',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
        pointsMultiplier: 1,
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
        [ChainKey.ETHEREUM]: {
          [TokenKey.WETH]: {
            token: tokensConfig[TokenKey.WETH],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
      },
      [ChainKey.PLUME]: {
        chain: ChainKey.PLUME,
      },
    },
  },
  [TokenKey.SUPUSD]: {
    apys: {},
    token: tokensConfig[TokenKey.SUPUSD],
    description:
      'Connect your wallet, select your deposit asset, and mint the Supra USD Default Asset to earn while you explore the Supra ecosystem.',
    comingSoon: false,
    isExternal: false,
    manuallyPaused: MANUALLY_PAUSED_NETWORK_ASSETS.includes(TokenKey.SUPUSD),
    chain: ChainKey.ETHEREUM,
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
      [ChainKey.ETHEREUM]: [TokenKey.USN, TokenKey.SUSN],
    },
    contracts: {
      teller: '0xc6111ddaf7119f313c9beda7ccac4eb7e05fd268',
      accountant: '0xf27803c9e5578e1350f5b5c9906b7973747d2ec4',
      boringVault: '0x61465652cceb2c63b17c56a3f5646566c753eeff',
    },
    receiveOn: ChainKey.ETHEREUM,
    points: [
      {
        key: PointSystemKey.NUCLEUS,
        name: 'Nucleus',
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
      redemptionSourceAsset: TokenKey.SUPUSD,
      redemptionDestinationChain: ChainKey.ETHEREUM,
      redemptionDestinationChains: {
        [ChainKey.ETHEREUM]: {
          chain: ChainKey.ETHEREUM,
          explorerBaseUrl: layerZeroBaseUrl,
        },
      },
      withdrawalChain: ChainKey.SUPRA,
      layerZeroChainSelector: 0,
      wantTokens: {
        [ChainKey.ETHEREUM]: {
          [TokenKey.SUSN]: {
            token: tokensConfig[TokenKey.SUSN],
            withdrawalFee: defaultWithdrawalFee, // Default 0.2%,
          },
        },
      },
    },
    protocols: [],
    tvlSources: {
      [ChainKey.ETHEREUM]: {
        chain: ChainKey.ETHEREUM,
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
  [NetworkKey.BOBA]: {
    id: boba.id,
    name: 'Boba',
    assets: mainnetNetworkAssets,
  },
  [NetworkKey.FORM]: {
    id: form.id,
    name: 'Form',
    assets: mainnetNetworkAssets,
  },
}
