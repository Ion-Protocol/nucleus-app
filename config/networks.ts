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
      teller: '0x97D0B97A9FA017f8aD2565a5c6AED5745f3918b9',
      accountant: '0x6035832F65b0cf20064681505b73A6dE307a04cB',
      boringVault: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
    },
    sourceChains: [ChainKey.ETHEREUM, ChainKey.SEI],
    sourceTokens: {
      [ChainKey.ETHEREUM]: [TokenKey.WETH, TokenKey.WSTETH, TokenKey.WEETH, TokenKey.RSETH, TokenKey.RSWETH],
      [ChainKey.SEI]: [TokenKey.WETH],
    },
    feeToken: TokenKey.ETH,
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
    feeToken: TokenKey.ETH,
    receiveOn: ChainKey.ETHEREUM,
    yieldAsset: TokenKey.EARNBTC,
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
    feeToken: TokenKey.ETH,
    receiveOn: ChainKey.ETHEREUM,
    yieldAsset: TokenKey.TETH,
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
