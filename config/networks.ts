import { Chain } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
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
    incentives: [
      {
        chainKey: ChainKey.SEI,
        rewardPercentage: 7.5,
      },
      {
        chainKey: ChainKey.DINERO,
        rewardPercentage: 7.5,
      },
    ],
    points: [
      {
        pointSystemKey: PointSystemKey.NUCLEUS,
        multiplier: 2,
      },
    ],
    description:
      'Connect your wallet, select your deposit asset, and mint the Sei Default Asset to earn while you explore the Sei ecosystem',
  },
  [ChainKey.SWELL]: {
    name: 'Swell',
    chainId: 1,
    comingSoon: true,
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
    yieldAsset: TokenKey.EARNBTC,
    networkSymbol: 'BTC',
    incentives: [],
    points: [],
    description: 'Swell is a liquid staking protocol for ETH, offering yield with flexible liquidity.',
  },
  [ChainKey.ECLIPSE]: {
    name: 'Eclipse',
    chainId: 1,
    comingSoon: true,
    contracts: {
      teller: '0x',
      accountant: '0x',
      boringVault: '0x',
    },
    sourceChains: [ChainKey.ETHEREUM],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH],
    },
    nativeToken: TokenKey.ETH,
    feeToken: TokenKey.ETH,
    receiveOn: ChainKey.ETHEREUM,
    yieldAsset: TokenKey.TETH,
    networkSymbol: 'ETH',
    incentives: [],
    points: [],
    description: '',
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
